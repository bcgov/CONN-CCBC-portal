-- Deploy ccbc:computed_columns/application_organization_name to pg

begin;

create or replace function ccbc_public.application_organization_name(application ccbc_public.application) returns text as $$
  select coalesce(asd.json_data ->>'organizationName', afd.json_data -> 'organizationProfile' ->> 'organizationName') from ccbc_public.application_form_data(application) as afd
  left join
  ccbc_public.application_sow_data as asd on asd.application_id = application.id
  -- may need to use change request number? Will need clarification
  order by asd.id desc
  limit 1;
$$ language sql stable;

grant execute on function ccbc_public.application_organization_name to ccbc_analyst;
grant execute on function ccbc_public.application_organization_name to ccbc_admin;

comment on function ccbc_public.application_organization_name is 'Computed column to display organization name from json data';

commit;
