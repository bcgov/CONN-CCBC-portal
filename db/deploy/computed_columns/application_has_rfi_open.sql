-- deploy ccbc:computed_columns/application_has_rfi_open to pg

begin;

create or replace function ccbc_public.application_has_rfi_open(application ccbc_public.application) returns boolean as
$$
  -- id is not null and ( rfiDueBy ? rfiDueByTimestamp > now() : true)
  select (id is not null) and (coalesce(to_timestamp(json_data ->> 'rfiDueBy', 'YYYY-MM-DD') > now(), 'true'::boolean)) from ccbc_public.application_rfi(application);

$$ language sql stable;

grant execute on function ccbc_public.application_has_rfi_open to ccbc_auth_user;

comment on function ccbc_public.application_has_rfi_open is 'Computed column to return whether the rfi is open';

commit;
