-- Deploy ccbc:computed_columns/cbc_history to pg

begin;

create or replace function ccbc_public.cbc_history(_cbc_project ccbc_public.cbc) returns setof ccbc_public.record_version as $$

  select *
  from (
    (
      select
        r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
        -- if the operation is an update, use the updated_by field in the record
        -- because created_by is listed as the person who initially created the record
        case when r.op = 'UPDATE'::audit.operation THEN COALESCE((r.record->>'updated_by')::int, r.created_by) else r.created_by end as created_by,
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
      where r.table_name = 'cbc_data' and r.record->>'cbc_id' = _cbc_project.id::text
    )

    union all

    (
      select
        v.id, v.record_id, v.old_record_id, v.op, v.ts, v.table_oid, v.table_schema, v.table_name,
        coalesce((v.record->>'updated_by')::int, v.created_by) as created_by,
        v.created_at,
        jsonb_strip_nulls(
          v.record || jsonb_build_object(
            'child_ccbc_number', child_application.ccbc_number,
            'parent_cbc_project_number', _cbc_project.project_number
          )
        ) as record,
        jsonb_strip_nulls(
          coalesce(v.old_record, '{}'::jsonb) || jsonb_build_object(
            'child_ccbc_number', old_child_application.ccbc_number,
            'parent_cbc_project_number', _cbc_project.project_number
          )
        ) as old_record
      from (
        select distinct on (child_application_id, effective_at)
          rv.*,
          coalesce(
            (rv.record->>'child_application_id')::int,
            (rv.old_record->>'child_application_id')::int
          ) as child_application_id,
          coalesce((rv.record->>'updated_at')::timestamptz, rv.created_at) as effective_at,
          (
            (rv.record->>'archived_at') is not null
            or (rv.old_record->>'archived_at') is not null
          ) as is_archived
        from ccbc_public.record_version rv
        where rv.table_name = 'application_merge'
          and rv.op in ('INSERT', 'UPDATE')
          and coalesce(
            (rv.record->>'parent_cbc_id')::int,
            (rv.old_record->>'parent_cbc_id')::int
          ) = _cbc_project.id
        order by
          child_application_id,
          effective_at,
          is_archived asc,
          created_at desc,
          id desc
      ) as v
      left join ccbc_public.application child_application
        on child_application.id = coalesce(
          (v.record->>'child_application_id')::int,
          (v.old_record->>'child_application_id')::int
        )
      left join ccbc_public.application old_child_application
        on old_child_application.id = (v.old_record->>'child_application_id')::int
    )
  ) merged_history
  order by
    coalesce((merged_history.record->>'updated_at')::timestamptz, merged_history.created_at) desc,
    merged_history.id desc;



$$ language sql stable;

grant execute on function ccbc_public.cbc_history to ccbc_admin;
grant execute on function ccbc_public.cbc_history to cbc_admin;
grant execute on function ccbc_public.cbc_history to ccbc_analyst;

comment on function ccbc_public.cbc_history is 'Get the history of a cbc record';

commit;
