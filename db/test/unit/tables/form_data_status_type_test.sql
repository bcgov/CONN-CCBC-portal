begin;

select plan(3);

-- Table exists

select
    has_table(
        'ccbc_public',
        'form_data_status_type',
        'ccbc_public.form_data_status_type should exist and be a table'
    );

-- Columns

select
    has_column(
        'ccbc_public',
        'form_data_status_type',
        'name',
        'The table form_data_status_type has column name'
    );

select
    has_column(
        'ccbc_public',
        'form_data_status_type',
        'description',
        'The table form_data_status_type has column description'
    );

select finish();

rollback;
