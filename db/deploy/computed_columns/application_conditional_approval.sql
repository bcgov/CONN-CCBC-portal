-- Deploy ccbc:computed_columns/application_conditional_approval to pg

begin;

create or replace function ccbc_public.application_conditional_approval(application ccbc_public.application)
returns ccbc_public.conditional_approval_data as
$$
select row(cp.*) from ccbc_public.conditional_approval_data as cp
    where cp.application_id = application.id
    and archived_at is null
    order by cp.id desc limit 1;
$$ language sql stable;

grant execute on function ccbc_public.application_conditional_approval to ccbc_analyst;
grant execute on function ccbc_public.application_conditional_approval to ccbc_admin;

comment on function ccbc_public.application_conditional_approval is 'Computed column to return conditional approval data';

commit;
