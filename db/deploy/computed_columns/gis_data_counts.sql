-- Deploy ccbc:computed_columns/gis_data_counts to pg

begin;

create or replace function ccbc_public.gis_data_counts(batchId int)
returns setof ccbc_public.gis_data_count as 
$$
    declare
        application_row_id int;
        ccbc_id text;
        json_row jsonb;
        json_file jsonb; 
    begin
    --  Create a temporary table
    CREATE TEMPORARY TABLE if not exists temp_application_gis
    (
        batch_id integer,
        application_id integer,
        json_data jsonb not null default '{}'::jsonb
    ) 
    ON COMMIT DROP;

    delete from temp_application_gis;

     -- load JSON data
    select json_data into json_file  from ccbc_public.gis_data where id = batchId;

    -- Loop over each object in the JSON array
    for json_row in select * from jsonb_array_elements(json_file)
    loop
        ccbc_id := json_row->>'ccbc_number'; 

        -- Look up the application_id based on the ccbc_number value
        select id into application_row_id from ccbc_public.application where ccbc_number = ccbc_id; 
        -- If no row was found, add to list 
        if found then
            insert into temp_application_gis (batch_id, application_id, json_data) 
            select batchId, application_row_id, json_row
            WHERE
              NOT EXISTS (
                SELECT id FROM ccbc_public.application_gis_data t 
                WHERE t.application_id = application_row_id and t.json_data = json_row
              );

        end if;
    end loop;

    return query select count(*)::int as total, 'new' as data_type,string_agg(ccbc_number, ', ') AS ccbc_numbers 
        from temp_application_gis agd 
        inner join ccbc_public.application app on agd.application_id=app.id 
    where agd.batch_id=batchId and agd.application_id not in
        (select application_id from ccbc_public.application_gis_data group by application_id)
    union all
    select count(*)::int as total, 'updated' as data_type,string_agg(ccbc_number, ', ') AS ccbc_numbers   
        from temp_application_gis agd
        inner join ccbc_public.application app on agd.application_id=app.id 
    where agd.batch_id=batchId and agd.application_id in
        (select application_id from ccbc_public.application_gis_data group by application_id)
    union all
        select  jsonb_array_length(json_data) as total, 'total' as data_type,null as ccbc_numbers 
        from ccbc_public.gis_data where id=batchId;
    end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.gis_data_counts to ccbc_analyst;
grant execute on function ccbc_public.gis_data_counts to ccbc_admin;

commit;
