-- Deploy ccbc:computed_columns/application_package to pg

begin;

create or replace function ccbc_public.application_package(application ccbc_public.application) returns integer as
$$
select package from ccbc_public.application_package
    where application_id = application.id
    and archived_at is null
    order by id desc limit 1;
$$ language sql stable;

comment on function ccbc_public.application_package is 'Computed column to return the package number for an application';

grant execute on function ccbc_public.application_package to ccbc_analyst;
grant execute on function ccbc_public.application_package to ccbc_admin;

commit;
