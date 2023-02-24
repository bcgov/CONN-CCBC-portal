-- Deploy ccbc:computed_columns/application_status_sort_filter to pg

begin;
create or replace function ccbc_public.application_status_sort_filter(application ccbc_public.application) returns text as
$$
select concat(ast.status_order, ' ', ast.name) from
    ccbc_public.application_status as appst,
    ccbc_public.application_status_type as ast
    where appst.application_id = application.id
    and appst.status = ast.name
    order by id desc limit 1;
$$ language sql stable;

comment on function ccbc_public.application_status_sort_filter is 'Computed column to return the status order with the status name appended for sorting and filtering';

grant execute on function ccbc_public.application_status_sort_filter to ccbc_analyst;
grant execute on function ccbc_public.application_status_sort_filter to ccbc_admin;

commit;
