-- Deploy ccbc:computed_columns/application_organization_name to pg

begin;

create or replace function ccbc_public.application_organization_name(application ccbc_public.application) returns text as $$
  select json_data -> 'organizationProfile' ->> 'organizationName' from ccbc_public.application_form_data(application);
$$ language sql stable;

grant execute on function ccbc_public.application_organization_name to ccbc_analyst;
grant execute on function ccbc_public.application_organization_name to ccbc_admin;

comment on function ccbc_public.application_organization_name is 'Computed column to display organization name from json data';

commit;
