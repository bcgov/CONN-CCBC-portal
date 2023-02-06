-- Deploy ccbc:computed_columns/application_status_order to pg

begin;
-- create or replace function ccbc_public.application_status(application ccbc_public.application)
create or replace function ccbc_public.application_status_order(application ccbc_public.application) returns int as
$$
select ast.status_order from
    ccbc_public.application_status as appst,
     ccbc_public.application_status_type as ast
    where appst.application_id= application.id
    and appst.status = ast.name
    order by id desc limit 1;
$$ language sql stable;

comment on function ccbc_public.application_status_order is 'Computed column to return the order of the status';

grant execute on function ccbc_public.application_status_order to ccbc_analyst;
grant execute on function ccbc_public.application_status_order to ccbc_admin;

commit;
