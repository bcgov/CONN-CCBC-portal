-- Deploy ccbc:computed_columns/application_gis_data to pg

begin;

drop function ccbc_public.application_gis_data(ccbc_public.application);

create or replace function ccbc_public.application_gis_data(application ccbc_public.application)
returns ccbc_public.application_gis_data as
$$
    select row(agd.*) from ccbc_public.application_gis_data agd
    where application_id = application.id
    and agd.archived_at is null order by agd.created_at desc limit 1;

$$ language sql stable;

grant execute on function ccbc_public.application_gis_data to ccbc_analyst;
grant execute on function ccbc_public.application_gis_data to ccbc_admin;
grant execute on function ccbc_public.application_gis_data to ccbc_auth_user;

comment on function ccbc_public.application_gis_data is 'Computed column to return last GIS data for an application';

commit;
