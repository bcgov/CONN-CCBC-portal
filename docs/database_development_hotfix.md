# Database Hotfix Guide

## Introduction

This guide provides instructions for implementing hotfixes in a database environment. It focuses on manual methods to bypass Sqitch, ensuring safe and consistent database management.

### Objective

- Safely implement hotfixes without disrupting Sqitch's change tracking mechanism.
- Ensure all changes are idempotent, allowing them to be applied multiple times without causing errors or unintended effects.

## General Principles for Hotfixes

1. **Backup First**: Always backup the database before applying any hotfix.
2. **Review and Test**: Changes should be reviewed and tested in our hotfix environment.
3. **Documentation**: Document the hotfix purpose, expected outcome, and steps taken.
4. **Idempotent Design**: Design SQL scripts to run multiple times safely.

## Examples

### 1. Updating a Function

```sql
    CREATE OR REPLACE FUNCTION my_function() RETURNS void AS $$
    BEGIN
      -- function logic here
    END;
    $$ LANGUAGE plpgsql;
```

### 2. Creating a Table

```sql
CREATE TABLE IF NOT EXISTS new_table (
  id serial PRIMARY KEY,
  column1 datatype,
  column2 datatype
);
```

### 3. Applying an Index

```sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'my_index' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX my_index ON my_table (my_column);
  END IF;
END;
$$
```

### 4. Applying a Constraint

```sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'my_table' AND constraint_name = 'my_constraint'
  ) THEN
    ALTER TABLE my_table ADD CONSTRAINT my_constraint UNIQUE (column1);
  END IF;
END;
$$
```

### 5. Adding a column

```sql
ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...
```

## Integration with Main Development

Rather than going through and applying the change again manually in each environment, to maintain parity and keep the codebase as the source of truth the change that was merged into hotfix should be represented as a sqitch change. Assuming the database script was written in a way that is idempotent (following the examples above) then there should be no issue applying the change a second time.
