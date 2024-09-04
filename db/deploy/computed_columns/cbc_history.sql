-- Deploy ccbc:computed_columns/cbc_history to pg

begin;

create or replace function ccbc_public.cbc_history(_cbc_project ccbc_public.cbc) returns setof ccbc_public.record_version as $$
  select * from ccbc_public.record_version
  where table_name = 'cbc_data' and record->>'cbc_id' = _cbc_project.id::text


$$ language sql stable;

grant execute on function ccbc_public.cbc_history to ccbc_admin;
grant execute on function ccbc_public.cbc_history to cbc_admin;
grant execute on function ccbc_public.cbc_history to ccbc_analyst;

comment on function ccbc_public.cbc_history is 'Get the history of a cbc record';

commit;
