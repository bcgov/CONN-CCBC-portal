-- deploy ccbc:computed_columns/application_intake_number to pg

begin;

create or replace function ccbc_public.application_intake_number(application ccbc_public.application) returns integer as
$$
select ccbc_intake_number from ccbc_public.intake
    where id = application.intake_id limit 1;
$$ language sql stable;

comment on function ccbc_public.application_package is 'Computed column to return the intake number for an application';

grant execute on function ccbc_public.application_intake_number to ccbc_analyst;
grant execute on function ccbc_public.application_intake_number to ccbc_admin;
grant execute on function ccbc_public.application_intake_number to ccbc_auth_user;

commit;
