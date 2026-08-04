# Text-to-SQL Generation Template

## Database Schema Context
{schema_context}

## User Question
{user_question}

## Instructions
1. Generate a valid SQL SELECT query for MotherDuck (DuckDB dialect)
2. Use only tables and columns present in the schema context
3. Never use INSERT, UPDATE, DELETE, DROP, or any DDL statements
4. Limit results to 1000 rows unless explicitly requested otherwise
5. Always include appropriate WHERE clauses to scope the data
6. Return ONLY the SQL query, no explanation

## SQL Query:
