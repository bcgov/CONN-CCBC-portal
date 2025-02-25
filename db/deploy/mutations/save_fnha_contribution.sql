-- Deploy ccbc:mutations/save_fnha_contribution to pg

begin;

create or replace function ccbc_public.save_fnha_contribution(_application_id int, _fnha_contribution decimal(10,2), _reason_for_change text default null)
returns ccbc_public.application_fnha_contribution
as $function$
declare
  fnha_record_id int;
begin
  select afc.id into fnha_record_id from ccbc_public.application_fnha_contribution as afc
    where afc.application_id = _application_id;

  if fnha_record_id is not null then
    update ccbc_public.application_fnha_contribution set fnha_contribution = _fnha_contribution, reason_for_change = _reason_for_change
    where id = fnha_record_id;
  else
    insert into ccbc_public.application_fnha_contribution (application_id, fnha_contribution, reason_for_change)
    values (_application_id, _fnha_contribution, _reason_for_change) returning id into fnha_record_id;
  end if;
  return (select row(ccbc_public.application_fnha_contribution.*) from ccbc_public.application_fnha_contribution where id = fnha_record_id);
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.save_fnha_contribution to ccbc_analyst;
grant execute on function ccbc_public.save_fnha_contribution to ccbc_admin;
grant execute on function ccbc_public.save_fnha_contribution to cbc_admin;

commit;
