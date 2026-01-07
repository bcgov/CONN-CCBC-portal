-- Deploy ccbc:computed_columns/application_history to pg

begin;

drop function if exists ccbc_public.application_history(application ccbc_public.application);
create or replace function ccbc_public.application_history(application ccbc_public.application)
returns setof ccbc_public.history_item as $$

  select application.id, v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record, 'application' as item,
      u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
  from ccbc_public.record_version as v
      inner join ccbc_public.ccbc_user u on v.created_by=u.id
  where v.op='INSERT' and v.table_name='application' and v.record->>'id'=application.id::varchar(10)
  union all

  select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record, v.record->>'status' as item,
      COALESCE(u.family_name,'Automated process'), COALESCE(u.given_name,''), COALESCE(u.session_sub,'robot@idir'), COALESCE(u.external_analyst,null), v.created_by
  from ccbc_public.record_version as v
      left join ccbc_public.ccbc_user u on v.created_by=u.id
  where v.op='INSERT' and v.table_name='application_status'
      and v.record->>'application_id'=application.id::varchar(10)
  union all

  select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record, v.record->>'assessment_data_type' as item,
      u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
  from ccbc_public.record_version as v
      inner join ccbc_public.ccbc_user u on v.created_by=u.id
  where v.op='INSERT' and v.table_name='assessment_data'
      and v.record->>'application_id'=application.id::varchar(10) and v.record->>'archived_by' is null

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record-> 'json_data' ->>'rfiType' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='rfi_data' and v.record->>'archived_by' is null
        and v.record->>'id' in (select rd.id::varchar(10) from ccbc_public.rfi_data as rd
        inner join ccbc_public.application_rfi_data arf
        on arf.rfi_data_id = rd.id
        where arf.application_id = application.id)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record-> 'json_data' ->>'rfiType' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on (v.record->>'updated_by')::integer=u.id
    where v.op='UPDATE' and v.table_name='rfi_data' and v.record->>'archived_by' is null
        and v.record->>'id' in (select rd.id::varchar(10) from ccbc_public.rfi_data as rd
        inner join ccbc_public.application_rfi_data arf
        on arf.rfi_data_id = rd.id
        where arf.application_id = application.id)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        concat_ws(' ', a.given_name, a.family_name) as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
        left join ccbc_public.analyst a on v.record->>'analyst_id' = a.id::varchar(10)
    where v.op='INSERT' and v.table_name='application_analyst_lead' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'package' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_package' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'conditional_approval_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='conditional_approval_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record-> 'json_data' ->>'reason_for_change' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='form_data' and v.record->>'archived_by' is null
        and v.record->>'id' in (
            select fd.id::varchar(10) from ccbc_public.form_data as fd,
                ccbc_public.form as f, ccbc_public.application_form_data as af
            where
                fd.form_schema_id = f.id and
                f.form_type = 'intake' and
                af.application_id = application.id and
                fd.id = af.form_data_id )

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'conditional_approval_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_gis_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id, v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by = u.id
    where (v.op='INSERT' or v.op='UPDATE') and v.table_name='application_gis_assessment_hh'
        and v.record->>'archived_by' is null and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where (v.op='INSERT' or v.op='UPDATE') and v.table_name='application_announced' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_announcement' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='project_information_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

union all
    select application.id, v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by = u.id
    where v.op ='INSERT' and v.table_name = 'application_sow_data'
        and v.record->>'application_id' = application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where  (v.op='INSERT' or v.op='UPDATE') and v.table_name='change_request_data'
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on (v.record->>'updated_by')::integer=u.id
    where v.table_name='application_announcement' and v.record->>'history_operation'='deleted'
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_community_progress_report_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_community_progress_report_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)


  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_community_progress_report_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on (v.record->>'updated_by')::integer=u.id
    where v.op='UPDATE' and v.table_name='application_community_progress_report_data' and v.record->>'history_operation'='deleted'
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_claims_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on (v.record->>'updated_by')::integer=u.id
    where v.op='UPDATE' and v.table_name='application_claims_data' and v.record->>'history_operation'='deleted'
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_community_claims_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_claims_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_milestone_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_milestone_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_milestone_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on (v.record->>'updated_by')::integer=u.id
    where v.op='UPDATE' and v.table_name='application_milestone_data' and v.record->>'history_operation'='deleted'
        and v.record->>'application_id'=application.id::varchar(10)

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_project_type' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_project_type' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_dependencies' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_dependencies' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_dependencies' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on u.id = (v.record->>'updated_by')::int
    where v.op='UPDATE' and v.table_name='application_dependencies' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)


    union all
    select
        application.id, v.created_at, v.op, v.table_name, v.record_id,
        jsonb_strip_nulls(
            v.record || jsonb_build_object(
            'child_ccbc_number', child_application.ccbc_number,
            'parent_ccbc_number',
                case
                when v.record->>'archived_at' is not null then 'N/A'
                else parent_application.ccbc_number
                end,
            'parent_cbc_project_number',
                case
                when v.record->>'archived_at' is not null then 'N/A'
                else parent_cbc.project_number::text
                end
            )
        ) as record,
        jsonb_strip_nulls(
            coalesce(v.old_record, '{}'::jsonb) || jsonb_build_object(
            'child_ccbc_number', old_child_application.ccbc_number,
            'parent_ccbc_number', old_parent_application.ccbc_number,
            'parent_cbc_project_number', old_parent_cbc.project_number::text
            )
        ) as old_record,
        v.record->>'application_merge' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst,
        coalesce((v.record->>'updated_by')::int, v.created_by) as created_by
        from (
          select distinct on (child_application_id, effective_at)
            mv.*,
            child_application_id,
            effective_at
          from (
            select
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
          ) mv
          order by
            child_application_id,
            effective_at,
            is_archived asc,
            created_at desc,
            id desc
        ) as v
        inner join ccbc_public.ccbc_user u
        on u.id = coalesce((v.record->>'updated_by')::int, v.created_by)
        left join ccbc_public.application child_application
        on child_application.id = coalesce(
            (v.record->>'child_application_id')::int,
            (v.old_record->>'child_application_id')::int
        )
        left join ccbc_public.application parent_application
        on parent_application.id = coalesce(
            (v.record->>'parent_application_id')::int,
            (v.old_record->>'parent_application_id')::int
        )
        left join ccbc_public.cbc parent_cbc
        on parent_cbc.id = coalesce(
            (v.record->>'parent_cbc_id')::int,
            (v.old_record->>'parent_cbc_id')::int
        )
        left join ccbc_public.application old_child_application
        on old_child_application.id = (v.old_record->>'child_application_id')::int
        left join ccbc_public.application old_parent_application
        on old_parent_application.id = (v.old_record->>'parent_application_id')::int
        left join ccbc_public.cbc old_parent_cbc
        on old_parent_cbc.id = (v.old_record->>'parent_cbc_id')::int
        where v.table_name = 'application_merge'
        and v.op in ('INSERT', 'UPDATE')
        and (
            v.record->>'child_application_id' = application.id::varchar(10)
            or v.record->>'parent_application_id' = application.id::varchar(10)
        )

    union all
    select application.id,  v.created_at, v.op, 'application_communities' as table_name, (array_agg(v.record_id))[1] AS record_id,
        jsonb_build_object('application_rd', jsonb_agg(jsonb_build_object('er', v.record->'er', 'rd', v.record->'rd'))) as record,
        jsonb_agg(v.old_record) AS old_record,
        MAX(v.record->>'application_rd') AS item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_rd' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)
    group by v.created_at, v.op, v.table_name, u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_fnha_contribution' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where (v.op='INSERT' or v.op='UPDATE') and v.table_name='application_fnha_contribution' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_pending_change_request' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_pending_change_request' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_internal_notes' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst, v.created_by
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where (v.op='INSERT' or v.op='UPDATE') and v.table_name='application_internal_notes' and v.record->>'archived_at' is null
        and v.record->>'application_id'=application.id::varchar(10);

$$ language sql stable;

grant execute on function ccbc_public.application_history to ccbc_admin;
grant execute on function ccbc_public.application_history to ccbc_analyst;

comment on function ccbc_public.application_history is 'Computed column that returns list of audit records for application';

commit;
