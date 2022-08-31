-- Deploy ccbc:computed_columns/application_status to pg
-- requires: tables/application_status

BEGIN;

create or replace function ccbc_public.application_status(application ccbc_public.application) returns text as 
$$
select status from ccbc_public.application_status 
    order by id desc limit 1;
$$ language sql stable;

comment on function ccbc_public.application_status is 'Computed column to return status of an application';

COMMIT;
