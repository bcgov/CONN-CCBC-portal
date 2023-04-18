-- Deploy ccbc:mutations/create_rfi to pg

begin;

create or replace function ccbc_public.create_rfi(application_row_id int, json_data jsonb)
returns ccbc_public.rfi_data
as $function$
declare
  result ccbc_public.rfi_data;
  new_rfi_id int;
  new_application_rfi_id int;
  new_rfi_number varchar(1000);
begin
  select 1 + count(*) into new_rfi_id from ccbc_public.application_rfi_data where application_id=application_row_id;
  select CONCAT(ccbc_number,'-',new_rfi_id) into new_rfi_number from ccbc_public.application where id=application_row_id;


  -- using nextval instead of returning id on insert to prevent triggering select RLS,
  -- which requires the rfi_data record
  new_rfi_id := nextval(pg_get_serial_sequence('ccbc_public.rfi_data','id'));

  insert into ccbc_public.rfi_data (id, rfi_number, json_data, rfi_data_status_type_id) overriding system value
    values (new_rfi_id, new_rfi_number, json_data, 'draft');

  insert into ccbc_public.application_rfi_data (application_id, rfi_data_id)
   values (application_row_id, new_rfi_id);

  select * from ccbc_public.rfi_data where id = new_rfi_id into result;
  return result;
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.create_rfi to ccbc_analyst;
grant execute on function ccbc_public.create_rfi to ccbc_admin;

commit;
