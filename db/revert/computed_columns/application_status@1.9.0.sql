-- Deploy ccbc:computed_columns/application_status to pg
-- requires: tables/application_status

begin;

create or replace function ccbc_public.application_status(application ccbc_public.application) returns varchar as
$$
select status from ccbc_public.application_status
    where application_id= application.id
    order by id desc limit 1;
$$ language sql stable;

grant execute on function ccbc_public.application_status to ccbc_auth_user;

comment on function ccbc_public.application_status is 'Computed column to return status of an application';

commit;
