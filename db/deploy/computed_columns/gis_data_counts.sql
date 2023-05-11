-- Deploy ccbc:computed_columns/gis_data_counts to pg

begin;

create or replace function ccbc_public.gis_data_counts(batchId int)
returns setof ccbc_public.gis_data_count  as
$$
declare
    json_file jsonb;
begin
-- load JSON data
select json_data into json_file  from ccbc_public.gis_data where id = batchId;

return query
    with json_rows as (
        select json_row
        from jsonb_array_elements(json_file) as json_row
    ),
    new_gis as (
        select
            (json_row->>'ccbc_number') as ccbc_number,
            a.id as application_id,
            json_row as json_data
        from json_rows, ccbc_public.application a
        where a.ccbc_number = (json_row->>'ccbc_number')
        and not exists (
            select 1
            from ccbc_public.application_gis_data agd
            where ((agd.created_at < (select created_at from ccbc_public.application_gis_data where application_id = a.id order by id asc limit 1)) or
            (agd.created_at < (select created_at from ccbc_public.gis_data where id = batchId order by id asc limit 1))) and application_id = a.id
        )
    ),
    updated as (
        select
            (json_row->>'ccbc_number') as ccbc_number,
            a.id as application_id,
            json_row as json_data
        from json_rows, ccbc_public.application a
        where a.ccbc_number = (json_row->>'ccbc_number')
        and exists (
            select 1
            from ccbc_public.application_gis_data agd
            where (agd.created_at < (select created_at from ccbc_public.application_gis_data where batch_id=batchId and application_id = a.id)) and
            application_id = a.id
        )
    ),
    unchanged as (
        select
            (json_row->>'ccbc_number') as ccbc_number,
            a.id as application_id,
            json_row as json_data
        from json_rows, ccbc_public.application a
        where a.ccbc_number = (json_row->>'ccbc_number')
        and not exists (
            select 1
            from ccbc_public.application_gis_data agd
            where batch_id=batchId and application_id = a.id
        )
    ),
    unmatched as (
        select
            (json_row->>'ccbc_number') as ccbc_number
        from json_rows
        where (json_row->>'ccbc_number') not in (select ccbc_number from ccbc_public.application where ccbc_number is not null)
    )
    select count(*)::int as total, 'new' as data_type, string_agg(ccbc_number, ', ') AS ccbc_numbers
    from new_gis agd
    union all
    select count(*)::int as total, 'updated' as data_type, string_agg(ccbc_number, ', ') AS ccbc_numbers
    from updated agd
    union all
    select count(*)::int as total, 'unmatched' as data_type, string_agg(ccbc_number, ', ') AS ccbc_numbers
    from unmatched
    union all
    select count(*)::int as total, 'unchanged' as data_type, string_agg(ccbc_number, ', ') AS ccbc_numbers
    from unchanged
    union all
    select jsonb_array_length(json_data) as total, 'total' as data_type, string_agg(json_data->>'ccbc_number', ', ') AS ccbc_numbers
    from ccbc_public.gis_data where id=batchId GROUP BY  gis_data.id,  json_data,  data_type;
end;
$$ language plpgsql stable;

grant execute on function ccbc_public.gis_data_counts to ccbc_analyst;
grant execute on function ccbc_public.gis_data_counts to ccbc_admin;

commit;
