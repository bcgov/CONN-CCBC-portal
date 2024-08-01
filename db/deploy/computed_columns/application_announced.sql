-- Deploy ccbc:computed_columns/application_announced to pg

BEGIN;

create or replace function ccbc_public.application_announced(application ccbc_public.application) returns boolean as
$$
select announced from ccbc_public.application_announced
  where application_id = application.id and archived_at is null
  order by id desc limit 1;
$$ language sql stable;

comment on function ccbc_public.application_package is 'Computed column to return the application announced status for an application';

grant execute on function ccbc_public.application_announced to ccbc_analyst;
grant execute on function ccbc_public.application_announced to ccbc_admin;

COMMIT;
