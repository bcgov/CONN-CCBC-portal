-- Deploy ccbc:computed_columns/application_zone to pg

BEGIN;

create or replace function ccbc_public.application_zone(application ccbc_public.application) returns int as $$
  declare
    zones int[];
    result int;
  begin
    select array(
        select (jsonb_array_elements_text(json_data -> 'projectArea' -> 'geographicArea')::int)
        from ccbc_public.application_form_data(application)
    ) into zones;

    zones := array(
        select unnest(zones) order by 1
    );

    if array_length(zones, 1) > 0 then
      result := zones[1];
    else
      result := null;
    end if;

    return result;
  end;
$$ language plpgsql stable;

grant execute on function ccbc_public.application_zone to ccbc_analyst;
grant execute on function ccbc_public.application_zone to ccbc_admin;

comment on function ccbc_public.application_zones is 'Computed column to get single lowest zone from json data, used for sorting';

COMMIT;
