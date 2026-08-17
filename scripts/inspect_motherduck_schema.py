"""
Inspect physical MotherDuck schemas
"""
import os
import duckdb
from dotenv import load_dotenv

backend_env = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", ".env")
load_dotenv(backend_env)

token = os.environ.get("MOTHERDUCK_TOKEN")
db_name = os.environ.get("MOTHERDUCK_DB", "indoprima")

con = duckdb.connect(f"md:{db_name}?token={token}&read_only=true")
df = con.execute("""
    SELECT table_schema, table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema IN ('manufacturing', 'supply_chain', 'finance')
    ORDER BY table_schema, table_name, ordinal_position;
""").fetchdf()

current_tbl = None
table_dict = {}
for _, row in df.iterrows():
    full_name = f"{row['table_schema']}.{row['table_name']}"
    if full_name not in table_dict:
        table_dict[full_name] = []
    table_dict[full_name].append(f"{row['column_name']} ({row['data_type']})")

for tbl, cols in table_dict.items():
    print(f"'{tbl}': [")
    for c in cols:
        print(f"    '{c}',")
    print("],")
