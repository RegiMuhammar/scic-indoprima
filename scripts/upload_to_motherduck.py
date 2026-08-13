"""
MotherDuck Batch Uploader — SCIC PT Indoprima
Uploads all 18 CSV files from datasets/quickwin_manufacturing/ into separate tables
inside the 'manufacturing' schema of MotherDuck database 'indoprima'.
"""

import os
import glob
import duckdb

# Path setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, "backend", ".env")
DATASET_DIR = os.path.join(BASE_DIR, "datasets", "quickwin_manufacturing")

# Parse backend/.env manually if python-dotenv is not installed
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
DB_NAME = os.environ.get("MOTHERDUCK_DB") or env.get("MOTHERDUCK_DB", "indoprima")
SCHEMA_NAME = "manufacturing"

def main():
    if not TOKEN:
        print("ERROR: MOTHERDUCK_TOKEN not found in environment or backend/.env!")
        return

    print(f"Connecting to MotherDuck Cloud...")
    print(f"  Database : {DB_NAME}")
    print(f"  Schema   : {SCHEMA_NAME}\n")

    connection_str = f"md:{DB_NAME}?token={TOKEN}"
    con = duckdb.connect(connection_str)

    # Create schema 'manufacturing' to keep domain data clean & organized like a folder
    con.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA_NAME};")
    con.execute(f"USE {DB_NAME}.{SCHEMA_NAME};")

    csv_files = glob.glob(os.path.join(DATASET_DIR, "*.csv"))
    if not csv_files:
        print(f"No CSV files found in {DATASET_DIR}!")
        return

    print(f"Found {len(csv_files)} CSV files. Creating separate tables under schema '{SCHEMA_NAME}'...\n")

    for file_path in sorted(csv_files):
        filename = os.path.basename(file_path)
        table_name = os.path.splitext(filename)[0]
        full_table_ref = f"{SCHEMA_NAME}.{table_name}"
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

    print(f"\nSuccessfully created all 18 tables in MotherDuck database '{DB_NAME}', schema '{SCHEMA_NAME}'!")

if __name__ == "__main__":
    main()
