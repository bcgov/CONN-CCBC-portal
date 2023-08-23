-- Deploy ccbc:mutations/create_application_claims_data to pg

begin;

create or replace function ccbc_public.create_application_claims_data(
    _application_id integer,
    _json_data jsonb,
    _old_claims_id integer default null,
    _excel_data_id integer default null
) returns ccbc_public.application_claims_data as $$
declare
  new_id integer;
  old_excel_data_id integer;
begin

  insert into ccbc_public.application_claims_data (application_id, json_data, excel_data_id)
  values (_application_id, _json_data, _excel_data_id)
  returning id into new_id;

  -- archive old claims data if it exists
  if exists (select * from ccbc_public.application_claims_data where id = _old_claims_id)
    then update ccbc_public.application_claims_data set archived_at = now() where id = _old_claims_id returning excel_data_id into old_excel_data_id;
  end if;

  -- archive excel data if the form data has no claims file data
   if(not (_json_data ? 'claimsFile') or jsonb_typeof(_json_data -> 'claimsFile') = 'null') then
      update ccbc_public.application_claims_excel_data set archived_at = now() where id = old_excel_data_id;
   end if;

  return (select row(ccbc_public.application_claims_data.*)
    from ccbc_public.application_claims_data
    where id = new_id);

end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_application_claims_data to ccbc_analyst;
grant execute on function ccbc_public.create_application_claims_data to ccbc_admin;

commit;
