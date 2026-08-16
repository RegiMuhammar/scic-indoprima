"""
MotherDuck Batch Uploader — SCIC PT Indoprima
Uploads all 34 CSV files into MotherDuck database:
- 16 tables into 'supply_chain' / main schema
- 18 tables into 'manufacturing' schema
"""

import os
import glob
import duckdb

# Path setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, "backend", ".env")

DATASET_GROUPS = {
    "supply_chain": [
        os.path.join(BASE_DIR, "datasets", "inventory"),
        os.path.join(BASE_DIR, "datasets", "invoices"),
        os.path.join(BASE_DIR, "datasets", "demand_history"),
        os.path.join(BASE_DIR, "datasets", "procurement"),
        os.path.join(BASE_DIR, "datasets", "erp_master"),
        os.path.join(BASE_DIR, "datasets", "ai_governance"),
    ],
    "manufacturing": [
        os.path.join(BASE_DIR, "datasets", "quickwin_manufacturing"),
    ]
}

def load_env(env_path):
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env_vars[k.strip()] = v.strip()
    return env_vars

env = load_env(ENV_PATH)
TOKEN = os.environ.get("MOTHERDUCK_TOKEN") or env.get("MOTHERDUCK_TOKEN")
DB_NAME = os.environ.get("MOTHERDUCK_DB") or env.get("MOTHERDUCK_DB", "scic_analytics")

def main():
    if not TOKEN:
        print("ERROR: MOTHERDUCK_TOKEN not found in environment or backend/.env!")
        return

    print(f"Connecting to MotherDuck Cloud...")
    print(f"  Database : {DB_NAME}\n")

    connection_str = f"md:{DB_NAME}?token={TOKEN}"
    con = duckdb.connect(connection_str)

    total_uploaded = 0

    for schema_name, directories in DATASET_GROUPS.items():
        print(f"==================================================")
        print(f"  SCHEMA: {schema_name}")
        print(f"==================================================")
        con.execute(f"CREATE SCHEMA IF NOT EXISTS {schema_name};")
        con.execute(f"USE {DB_NAME}.{schema_name};")

        schema_csvs = []
        for d in directories:
            schema_csvs.extend(glob.glob(os.path.join(d, "*.csv")))

        print(f"Found {len(schema_csvs)} CSV files for schema '{schema_name}'...\n")

        for file_path in sorted(schema_csvs):
            filename = os.path.basename(file_path)
            table_name = os.path.splitext(filename)[0]
            full_table_ref = f"{schema_name}.{table_name}"
            normalized_path = file_path.replace("\\", "/")

            print(f"Uploading {filename} -> Table: {full_table_ref}...", end=" ", flush=True)
            
            # Sort telemetry table for block pruning optimization
            if table_name == "fact_machine_telemetry":
                query = f"CREATE OR REPLACE TABLE {full_table_ref} AS SELECT * FROM read_csv_auto('{normalized_path}') ORDER BY machine_id, timestamp;"
            else:
                query = f"CREATE OR REPLACE TABLE {full_table_ref} AS SELECT * FROM read_csv_auto('{normalized_path}');"
            
            con.execute(query)
            row_count = con.execute(f"SELECT COUNT(*) FROM {full_table_ref};").fetchone()[0]
            print(f"DONE ({row_count:,} rows)")
            total_uploaded += 1

    print(f"\n==================================================")
    print(f" Successfully created all {total_uploaded} tables in MotherDuck DB '{DB_NAME}'!")
    print(f"==================================================")

if __name__ == "__main__":
    main()
