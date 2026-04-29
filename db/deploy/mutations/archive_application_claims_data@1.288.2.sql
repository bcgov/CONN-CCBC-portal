-- Deploy ccbc:mutations/archive_application_claims_data to pg

begin;

create or replace function ccbc_public.archive_application_claims_data(_claims_data_id integer)
returns void as $$
declare
  _excel_data_id integer;
begin

  select excel_data_id into _excel_data_id from ccbc_public.application_claims_data
  where id = _claims_data_id;

  -- archive the old claim excel data
  if exists (select * from ccbc_public.application_claims_excel_data where id = _excel_data_id)
    then update ccbc_public.application_claims_excel_data
    set archived_at = now()
    where id = _excel_data_id;
  end if;

  -- archive the claim
  update ccbc_public.application_claims_data
  set archived_at = now(), history_operation = 'deleted'
  where id = _claims_data_id
  and archived_at is null;

end

$$ language plpgsql;

grant execute on function ccbc_public.archive_application_claims_data to ccbc_analyst, ccbc_admin;

comment on function ccbc_public.archive_application_claims_data is 'Mutation to archive an application claims data as well as the associated excel data';

commit;
