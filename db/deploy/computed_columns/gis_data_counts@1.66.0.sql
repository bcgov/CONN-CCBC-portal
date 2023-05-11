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
    application_gis_data as (
        select
            (json_row->>'ccbc_number') as ccbc_number,
            a.id as application_id,
            json_row as json_data
        from json_rows, ccbc_public.application a
        where a.ccbc_number = (json_row->>'ccbc_number')
        and not exists (
            select 1
            from ccbc_public.application_gis_data agd
            where agd.application_id = a.id and agd.json_data = json_row
        )
    )
    select count(*)::int as total, 'new' as data_type, string_agg(ccbc_number, ', ') AS ccbc_numbers
    from application_gis_data agd
    where agd.application_id not in
        (select application_id from ccbc_public.application_gis_data group by application_id)
    union all
    select count(*)::int as total, 'updated' as data_type, string_agg(ccbc_number, ', ') AS ccbc_numbers
    from application_gis_data agd
    where agd.application_id in
        (select application_id from ccbc_public.application_gis_data group by application_id)
    union all
    select jsonb_array_length(json_data) as total, 'total' as data_type, null as ccbc_numbers
    from ccbc_public.gis_data where id=batchId;
end;
$$ language plpgsql stable;

grant execute on function ccbc_public.gis_data_counts to ccbc_analyst;
grant execute on function ccbc_public.gis_data_counts to ccbc_admin;

commit;
