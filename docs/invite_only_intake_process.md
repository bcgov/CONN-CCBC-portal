Markdown# How to Generate an Invite-Only Link for Application Intake

This guide explains how to create a private (invite-only) access link for an open intake by generating a unique hidden code in the database and constructing the appropriate URL.

## Prerequisites

- Access to the Postgres database
- The `uuid-ossp` extension must be enabled in the database (required for `uuid_generate_v4()`)

## Step 1: Generate the hidden code

Run the following SQL script against the database. It will automatically generate a new UUID and store it in the `hidden_code` column for **all currently open, non-hidden, non-archived intakes**.

```sql
UPDATE ccbc_public.intake
SET hidden_code = uuid_generate_v4()
WHERE close_timestamp > NOW()
  AND hidden = false
  AND archived_at IS NULL;
```

Important: This query updates every open intake that matches the conditions. If you only want to update a specific intake, add AND id = <intake_id> to the WHERE clause.

Verify the generated code (optional but recommended)

```sql
SELECT id, intake_number, hidden_code
FROM ccbc_public.intake
WHERE close_timestamp > NOW()
  AND hidden = false
  AND archived_at IS NULL;
```

## Step 2: Copy the generated hidden_code

Take note of the UUID value shown in the hidden_code column for the intake you want to share privately.
Example output:

```text
hidden_code
--------------------------------------
 a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8
```

## Step 3: Create the invite-only link

Construct the URL using the following format:

```text
<BASE_URL>/api/intake?code=<HIDDEN_CODE>
```

Replace:

<BASE_URL> → the base URL depending on environment
<HIDDEN_CODE> → the full UUID from Step 2

Example of a complete invite-only link

```text
https://myurl.ca/api/intake?code=a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8
```

## Optional: Revoking access

To invalidate a specific invite link in the future, simply run:

```sql
UPDATE ccbc_public.intake
SET hidden_code = NULL
WHERE id = <intake_id>;
```

Or generate a new code (which invalidates the previous one):

```sql
UPDATE ccbc_public.intake
SET hidden_code = uuid_generate_v4()
WHERE id = <intake_id>;
```
