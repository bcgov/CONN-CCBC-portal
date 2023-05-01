-- Deploy ccbc:computed_columns/application_gis_data to pg

begin;

drop function if exists ccbc_public.application_gis_data(ccbc_public.application);

create or replace function ccbc_public.application_gis_data(application ccbc_public.application)
returns ccbc_public.gis_data_item as
$$
    select arr.item_object as json_data from ccbc_public.gis_data as gd,
    jsonb_array_elements(gd.json_data) with ordinality arr(item_object, position)
    where arr.item_object->>'ccbc_number' = application.ccbc_number
    and gd.archived_at is null order by gd.created_at desc limit 1;

$$ language sql stable;

grant execute on function ccbc_public.application_gis_data to ccbc_analyst;
grant execute on function ccbc_public.application_gis_data to ccbc_admin;
grant execute on function ccbc_public.application_gis_data to ccbc_auth_user;

comment on function ccbc_public.application_gis_data is 'Computed column to return last GIS data for an application';

commit;
