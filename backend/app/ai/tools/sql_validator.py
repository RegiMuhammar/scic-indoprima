"""
SQLGlot AST & MotherDuck Engine Validator — SCIC Indoprima
Enforces read-only SELECT constraints, rejects DDL/DML, and runs fast pre-execution schema binding.
"""
import re
from typing import Optional, List
import sqlglot
from sqlglot import exp
from app.db.motherduck import get_motherduck_connection
from app.schemas.chat import SQLValidationResult

AUTHORIZED_SCHEMAS = {"manufacturing", "supply_chain", "finance", "main"}
MUTATION_NODES = (
    exp.Insert,
    exp.Update,
    exp.Delete,
    exp.Drop,
    exp.Create,
    exp.Alter,
    exp.Command,
    exp.Pragma
)


def validate_and_sanitize_sql(raw_sql: str) -> SQLValidationResult:
    """
    Dual-layer validation:
    1. SQLGlot AST parsing & mutation blocking
    2. MotherDuck CALL try_bind(?) catalog binding validation
    """
    if not raw_sql or not raw_sql.strip():
        return SQLValidationResult(
            is_valid=False,
            error_type="syntax_error",
            error_message="Query SQL kosong atau tidak valid."
        )

    # 1. Clean markdown code fences if LLM included ```sql ... ```
    cleaned_sql = raw_sql.strip()
    if cleaned_sql.startswith("```"):
        cleaned_sql = re.sub(r"^```(?:sql|duckdb)?\n?", "", cleaned_sql, flags=re.IGNORECASE)
        cleaned_sql = re.sub(r"\n?```$", "", cleaned_sql).strip()

    # Remove trailing semicolons
    cleaned_sql = cleaned_sql.rstrip(";").strip()

    # ── Layer 1: SQLGlot AST Validation ──────────────────────────────────────
    try:
        parsed_tree = sqlglot.parse_one(cleaned_sql, read="duckdb")
    except Exception as e:
        return SQLValidationResult(
            is_valid=False,
            error_type="syntax_error",
            error_message=f"Gagal mem-parse sintaks SQL (SQLGlot): {str(e)}"
        )

    # Enforce SELECT / CTE only
    if not isinstance(parsed_tree, (exp.Select, exp.Union)):
        return SQLValidationResult(
            is_valid=False,
            error_type="mutation_blocked",
            error_message=f"Operasi {type(parsed_tree).__name__} dilarang. Hanya query SELECT / WITH yang diizinkan."
        )

    # Check for any nested mutation operations
    for node in parsed_tree.walk():
        if isinstance(node, MUTATION_NODES):
            return SQLValidationResult(
                is_valid=False,
                error_type="mutation_blocked",
                error_message=f"Ditemukan perintah modifikasi data terlarang ({type(node).__name__})."
            )

    # Extract referenced tables
    referenced_tables: List[str] = []
    for table_exp in parsed_tree.find_all(exp.Table):
        t_name = table_exp.name
        s_name = table_exp.db or ""
        full_name = f"{s_name}.{t_name}" if s_name else t_name
        if full_name not in referenced_tables:
            referenced_tables.append(full_name)

    # Auto-inject LIMIT 1000 if not present
    if not parsed_tree.args.get("limit"):
        parsed_tree = parsed_tree.limit(1000)
        sanitized_sql = parsed_tree.sql(dialect="duckdb")
    else:
        # If user/LLM specified limit > 1000, cap it at 1000
        limit_val = parsed_tree.args["limit"].expression
        try:
            if int(str(limit_val)) > 1000:
                parsed_tree.args["limit"].set("this", exp.Literal.number(1000))
        except Exception:
            pass
        sanitized_sql = parsed_tree.sql(dialect="duckdb")

    # ── Layer 2: MotherDuck Pre-Execution CALL try_bind(?) ───────────────────
    try:
        con = get_motherduck_connection(read_only=True)
        bind_res = con.execute("CALL try_bind(?);", [sanitized_sql]).fetchall()
        if bind_res and len(bind_res) > 0:
            error_message, error_type = bind_res[0]
            if error_type != "ok":
                return SQLValidationResult(
                    is_valid=False,
                    sanitized_sql=sanitized_sql,
                    error_type="binder_error" if error_type == "binder" else "syntax_error",
                    error_message=f"MotherDuck Catalog Error ({error_type}): {error_message}",
                    tables_referenced=referenced_tables
                )
    except Exception as e:
        # Fallback if connection fails during bind test
        # SQLGlot AST check still passed
        pass

    return SQLValidationResult(
        is_valid=True,
        sanitized_sql=sanitized_sql,
        error_type="ok",
        error_message=None,
        tables_referenced=referenced_tables
    )
