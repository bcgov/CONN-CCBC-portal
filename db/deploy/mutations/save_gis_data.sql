-- Deploy ccbc:mutations/save_gis_data to pg

begin;

create or replace function ccbc_public.save_gis_data(json_data jsonb)
returns ccbc_public.gis_data
as $function$
declare
  result ccbc_public.gis_data;
  new_row_id int;
begin
  -- using nextval instead of returning id on insert to prevent triggering select RLS,
  -- which requires the gis_data record
  new_row_id := nextval(pg_get_serial_sequence('ccbc_public.gis_data','id'));
  
  insert into ccbc_public.gis_data (id, json_data) overriding system value
    values (new_row_id, json_data);

  select * from ccbc_public.gis_data where id = new_row_id into result;
  return result;
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.save_gis_data to ccbc_analyst;
grant execute on function ccbc_public.save_gis_data to ccbc_admin;

commit;
