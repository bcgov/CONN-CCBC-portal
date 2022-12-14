-- deploy ccbc:mutations/update_rfi to pg

begin;

create or replace function ccbc_public.update_rfi(rfi_row_id int, json_data jsonb)
returns ccbc_public.rfi_data as $function$
declare
_application_id int;
_rfi_number varchar(1000);
new_rfi_id int;
_status_type varchar(1000);
begin

  select application_id into _application_id from ccbc_public.application_rfi_data where rfi_data_id = rfi_row_id;

  update ccbc_public.rfi_data set archived_at = now() where id = rfi_row_id
    returning rfi_number, rfi_data_status_type_id into _rfi_number, _status_type;

  -- using nextval instead of returning id on insert to prevent triggering select RLS,
  -- which requires the rfi_data record
  new_rfi_id := nextval(pg_get_serial_sequence('ccbc_public.rfi_data','id'));

  insert into ccbc_public.rfi_data (id, rfi_number, json_data, rfi_data_status_type_id) overriding system value
    values (new_rfi_id, _rfi_number, json_data, _status_type);

  insert into ccbc_public.application_rfi_data (application_id, rfi_data_id)
   values (_application_id, new_rfi_id);

  return (select row(rfi_data.*)::ccbc_public.rfi_data from ccbc_public.rfi_data where id = new_rfi_id);

end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.update_rfi to ccbc_analyst;
grant execute on function ccbc_public.update_rfi to ccbc_admin;
grant execute on function ccbc_public.update_rfi to ccbc_auth_user;




commit;
