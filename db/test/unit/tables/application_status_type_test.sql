begin;

select plan(3);

-- Table exists

select
    has_table(
        'ccbc_public',
        'application_status_type',
        'ccbc_public.application_status_type should exist and be a table'
    );

-- Columns

select
    has_column(
        'ccbc_public',
        'application_status_type',
        'name',
        'The table application_status_type has column name'
    );

select
    has_column(
        'ccbc_public',
        'application_status_type',
        'description',
        'The table application_status_type has column description'
    );

select finish();

rollback;
