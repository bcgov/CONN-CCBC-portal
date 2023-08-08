-- Deploy ccbc:computed_columns/application_zones to pg

begin;

create or replace function ccbc_public.application_zones(application ccbc_public.application) returns int[] as $$
  declare
    result int[];
  begin
    select array(
        select (jsonb_array_elements_text(json_data -> 'projectArea' -> 'geographicArea')::int)
        from ccbc_public.application_form_data(application)
    ) into result;

    return result;
  end;
$$ language plpgsql stable;

grant execute on function ccbc_public.application_zones to ccbc_analyst;
grant execute on function ccbc_public.application_zones to ccbc_admin;

comment on function ccbc_public.application_zones is 'Computed column to get zones from json data';

commit;
