"""
Run Supabase Migration for Chat Tables
"""
import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

# Load env from backend/.env
backend_env = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", ".env")
load_dotenv(backend_env)

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in backend/.env")
    exit(1)

# Ensure asyncpg driver
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

SQL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sql", "03_chat_schema.sql")

async def main():
    print(f"Connecting to Supabase PostgreSQL...")
    engine = create_async_engine(DATABASE_URL)
    with open(SQL_FILE, "r", encoding="utf-8") as f:
        sql_script = f.read()

    try:
        async with engine.begin() as conn:
            # Execute statement by statement
            for statement in sql_script.split(";"):
                stmt = statement.strip()
                if stmt:
                    await conn.execute(text(stmt))
        print("Schema migration APPLIED successfully!")

        async with engine.connect() as conn:
            res = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"))
            tables = res.scalars().all()
            print("Current public tables in Supabase:", tables)
    except Exception as e:
        print(f"Migration error: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
