-- Deploy ccbc:mutations/parse_gis_data to pg

BEGIN;

create or replace function ccbc_public.parse_gis_data(batchId int)
returns text as
$function$

declare
  application_row_id int;
  ccbc_id text;
  json_row jsonb;
  json_file jsonb;
  new_row_id int;
  result text;
begin
    result := null;

    -- load JSON data
    select json_data into json_file  from ccbc_public.gis_data where id = batchId;

    -- Loop over each object in the JSON array
    for json_row in select * from jsonb_array_elements(json_file)
    loop
        ccbc_id := json_row->>'ccbc_number';

        -- Look up the application_id based on the ccbc_number value
        select id into application_row_id from ccbc_public.application where ccbc_number = ccbc_id;
        -- If no row was found, add to list
        if not found then
            result := coalesce(result || ',','') || ccbc_id;
            -- RAISE EXCEPTION 'No matching row in ccbc_public.application for ccbc_number %', ccbc_id;
        else
            insert into ccbc_public.application_gis_data (batch_id, application_id, json_data)
            select batchId, application_row_id, json_row
            WHERE
              NOT EXISTS (
                SELECT id FROM ccbc_public.application_gis_data t
                WHERE t.application_id = application_row_id and t.json_data = json_row
              );

        end if;
    end loop;
  return result;
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.parse_gis_data to ccbc_analyst;
grant execute on function ccbc_public.parse_gis_data to ccbc_admin;

commit;
