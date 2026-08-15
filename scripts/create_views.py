"""
Script to create analytical SQL views in MotherDuck Cloud
"""
import os
import duckdb

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, "backend", ".env")
VIEW_SQL_PATH = os.path.join(BASE_DIR, "scripts", "sql", "02_create_oee_views.sql")

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

if not TOKEN:
    print("MOTHERDUCK_TOKEN not found!")
    exit(1)

con = duckdb.connect(f"md:{DB_NAME}?token={TOKEN}")
with open(VIEW_SQL_PATH, "r", encoding="utf-8") as f:
    sql_script = f.read()

con.execute(sql_script)
print("Successfully created analytical views in MotherDuck!")
