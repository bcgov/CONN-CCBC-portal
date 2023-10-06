-- Deploy ccbc:computed_columns/application_internal_description to pg

begin;

create or replace function ccbc_public.application_internal_description(application ccbc_public.application) returns text as
$$
select description from ccbc_public.application_internal_description
  where application_id = application.id and archived_at is null
  order by id desc limit 1;
$$ language sql stable;

comment on function ccbc_public.application_package is 'Computed column to return the internal description for an application';

grant execute on function ccbc_public.application_internal_description to ccbc_analyst;
grant execute on function ccbc_public.application_internal_description to ccbc_admin;

commit;
