begin;

select plan(3);

-- Table exists

select
    has_table(
        'ccbc_public',
        'assessment_type',
        'ccbc_public.assessment_type should exist and be a table'
    );

-- Columns

select
    has_column(
        'ccbc_public',
        'assessment_type',
        'name',
        'The table assessment_type has column name'
    );

select
    has_column(
        'ccbc_public',
        'assessment_type',
        'description',
        'The table assessment_type has column description'
    );

select finish();

rollback;
