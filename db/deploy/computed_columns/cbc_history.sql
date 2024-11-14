-- Deploy ccbc:computed_columns/cbc_history to pg

begin;

create or replace function ccbc_public.cbc_history(_cbc_project ccbc_public.cbc) returns setof ccbc_public.record_version as $$

  select
    r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
    -- if the operation is an update, use the updated_by field in the record
    -- because created_by is listed as the person who initially created the record
    case when r.op = 'UPDATE'::audit.operation then (r.record->>'updated_by')::int else r.created_by end as created_by,
    r.created_at,
    -- Add added_communities and deleted_communities to the record JSON field
    r.record || jsonb_build_object(
        'added_communities', (
            select jsonb_agg(
                community.record || (
                    select row_to_json(cs)::jsonb
                    from ccbc_public.communities_source_data as cs
                    where cs.geographic_name_id = (community.record->>'communities_source_data_id')::int
                )
            )
            from ccbc_public.record_version as community
            where community.ts = r.ts
              and community.created_by = created_by
              and community.table_name = 'cbc_project_communities'
              and community.op = 'INSERT'
        ),
        'deleted_communities', (
            select jsonb_agg(
                community.record || (
                    select row_to_json(cs)::jsonb
                    from ccbc_public.communities_source_data as cs
                    where cs.geographic_name_id = (community.record->>'communities_source_data_id')::int
                )
            )
            from ccbc_public.record_version as community
            where community.ts = r.ts
              and community.created_by = created_by
              and community.table_name = 'cbc_project_communities'
              and community.op = 'UPDATE'
        )
    ) as record,
    r.old_record
  from ccbc_public.record_version as r
  where table_name = 'cbc_data' and r.record->>'cbc_id' = _cbc_project.id::text
  -- order by record->>'updated_at' since created_at is filled with the initial record creation date
  -- could be replaced by id desc, should give the same result
  order by r.record->>'updated_at' desc;



$$ language sql stable;

grant execute on function ccbc_public.cbc_history to ccbc_admin;
grant execute on function ccbc_public.cbc_history to cbc_admin;
grant execute on function ccbc_public.cbc_history to ccbc_analyst;

comment on function ccbc_public.cbc_history is 'Get the history of a cbc record';

commit;
