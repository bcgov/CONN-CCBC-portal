-- Deploy ccbc:mutations/create_application_claims_data to pg

begin;

create or replace function ccbc_public.create_application_claims_data(
    _application_id integer,
    _json_data jsonb,
    _old_claims_id integer default null
) returns ccbc_public.application_claims_data as $$
declare
  new_id integer;
begin

  insert into ccbc_public.application_claims_data (application_id, json_data)
  values (_application_id, _json_data)
  returning id into new_id;

  if exists (select * from ccbc_public.application_claims_data where id = _old_claims_id)
    then update ccbc_public.application_claims_data set archived_at = now() where id = _old_claims_id;
  end if;

  return (select row(ccbc_public.application_claims_data.*)
    from ccbc_public.application_claims_data
    where id = new_id);

end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_application_claims_data to ccbc_analyst;
grant execute on function ccbc_public.create_application_claims_data to ccbc_admin;

commit;
