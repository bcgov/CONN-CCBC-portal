-- Deploy ccbc:computed_columns/cbc_history to pg

begin;

create or replace function ccbc_public.cbc_history(_cbc_project ccbc_public.cbc) returns setof ccbc_public.record_version as $$

  select id, record_id, old_record_id, op, ts, table_oid, table_schema, table_name,
    -- if the operation is an update, use the updated_by field in the record
    -- because created_by is listed as the person who initially created the record
    case when op = 'UPDATE'::audit.operation then (record->>'updated_by')::int else created_by end as created_by,
    created_at, record, old_record
  from ccbc_public.record_version
  where table_name = 'cbc_data' and record->>'cbc_id' = _cbc_project.id::text
  -- order by record->>'updated_at' since created_at is filled with the initial record creation date
  -- could be replaced by id desc, should give the same result
  order by record->>'updated_at' desc;


$$ language sql stable;

grant execute on function ccbc_public.cbc_history to ccbc_admin;
grant execute on function ccbc_public.cbc_history to cbc_admin;
grant execute on function ccbc_public.cbc_history to ccbc_analyst;

comment on function ccbc_public.cbc_history is 'Get the history of a cbc record';

commit;
