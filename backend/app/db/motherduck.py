"""
MotherDuck (DuckDB Cloud) connection module for SCIC PT Indoprima
Handles OLAP analytics queries and Text-to-SQL execution.
"""

import os
import duckdb

def get_motherduck_connection(read_only: bool = False) -> duckdb.DuckDBPyConnection:
    """
    Establishes and returns a connection to MotherDuck cloud database.
    Fallback to local DuckDB file if MOTHERDUCK_TOKEN is not set.
    """
    token = os.environ.get("MOTHERDUCK_TOKEN")
    db_name = os.environ.get("MOTHERDUCK_DB", "indoprima")
    
    if token:
        conn_str = f"md:{db_name}?token={token}"
        if read_only:
            conn_str += "&read_only=true"
    else:
        conn_str = f"{db_name}.duckdb"

    con = duckdb.connect(conn_str)
    
    # Set default search path to manufacturing schema
    con.execute(f"CREATE SCHEMA IF NOT EXISTS {db_name}.manufacturing;")
    con.execute(f"USE {db_name}.manufacturing;")
    
    return con
