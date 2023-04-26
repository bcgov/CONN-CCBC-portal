-- Deploy ccbc:computed_columns/gis_data_counts to pg

begin;

create or replace function ccbc_public.gis_data_counts(batchId int)
returns setof ccbc_public.gis_data_count as 
$$
    select count(*)::int as total, 'new' as data_type,string_agg(ccbc_number, ', ') AS ccbc_numbers 
        from ccbc_public.application_gis_data agd 
        inner join ccbc_public.application app on agd.application_id=app.id 
    where agd.batch_id=batchId
        and application_id not in
        (select application_id from ccbc_public.application_gis_data where batch_id<>batchId  group by application_id)
    union all
    select count(*)::int as total, 'updated' as data_type,string_agg(ccbc_number, ', ') AS ccbc_numbers   
        from ccbc_public.application_gis_data agd
        inner join ccbc_public.application app on agd.application_id=app.id 
    where agd.batch_id=batchId
        and application_id in
        (select application_id from ccbc_public.application_gis_data where batch_id<>batchId  group by application_id)
    union all
        select  jsonb_array_length(json_data) as total, 'total' as data_type,null as ccbc_numbers 
        from ccbc_public.gis_data where id=batchId;
$$ language sql stable;

grant execute on function ccbc_public.gis_data_counts to ccbc_analyst;
grant execute on function ccbc_public.gis_data_counts to ccbc_admin;

commit;
