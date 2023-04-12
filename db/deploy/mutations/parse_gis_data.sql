-- Deploy ccbc:mutations/parse_gis_data to pg

BEGIN;

create or replace function ccbc_public.parse_gis_data(batchId int)
returns void as 
$function$

declare
  application_id int;
  ccbc_id text;
  json_row jsonb;
  json_file jsonb;
begin
  -- load JSON data
  select json_data into json_file  from ccbc_public.gis_data where id = batchId;

  -- Loop over each object in the JSON array
  for json_row in select * from jsonb_array_elements(json_file)
  loop
    RAISE NOTICE 'json_row is currently %', json_row; 
    ccbc_id := json_row->>'ccbc_number';
    -- Look up the application_id based on the ccbc_number value
    select id into application_id from ccbc_public.application where ccbc_number = ccbc_id;
    -- If no row was found, raise an error
    if not found then
      RAISE EXCEPTION 'No matching row in ccbc_public.application for ccbc_number %', ccbc_id;
    end if;

    insert into ccbc_public.application_gis_data (batch_id, application_id, json_data)
    values (batch_id, application_id, json_row);
  end loop;
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.parse_gis_data to ccbc_analyst;
grant execute on function ccbc_public.parse_gis_data to ccbc_admin;

commit;
