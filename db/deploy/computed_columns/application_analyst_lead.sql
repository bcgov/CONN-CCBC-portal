-- Deploy ccbc:computed_columns/application_analyst_lead to pg

begin;

create or replace function ccbc_public.application_analyst_lead(application ccbc_public.application) returns varchar as
$$
select concat_ws(' ', given_name, family_name) AS name from ccbc_public.application_analyst_lead as al
    inner join ccbc_public.analyst a on a.id = al.analyst_id
    where al.application_id = application.id
    order by al.id desc limit 1;
$$ language sql stable;

grant execute on function ccbc_public.application_analyst_lead to ccbc_analyst;
grant execute on function ccbc_public.application_analyst_lead to ccbc_admin;

comment on function ccbc_public.application_analyst_lead is 'Computed column to return analyst lead of an application';

commit;
