-- Deploy ccbc:computed_columns/application_history to pg

begin;

create or replace function ccbc_public.application_history(application ccbc_public.application)
returns setof ccbc_public.history_item as $$

  select application.id, v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record, 'application' as item,
      u.family_name, u.given_name, u.session_sub, u.external_analyst
  from ccbc_public.record_version as v
      inner join ccbc_public.ccbc_user u on v.created_by=u.id
  where v.op='INSERT' and v.table_name='application' and v.record->>'id'=application.id::varchar(10)
  union all

  select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record, v.record->>'status' as item,
      COALESCE(u.family_name,'Automated process'), COALESCE(u.given_name,''), COALESCE(u.session_sub,'robot@idir'), COALESCE(u.external_analyst,null)
  from ccbc_public.record_version as v
      left join ccbc_public.ccbc_user u on v.created_by=u.id
  where v.op='INSERT' and v.table_name='application_status'
      and v.record->>'application_id'=application.id::varchar(10)
  union all

  select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record, v.record->>'file_name' as item,
      u.family_name, u.given_name, u.session_sub, u.external_analyst
  from ccbc_public.record_version as v
      inner join ccbc_public.ccbc_user u on v.created_by=u.id
  where v.op='INSERT' and v.table_name='attachment'
      and v.record->>'application_id'=application.id::varchar(10) and v.record->>'archived_by' is null

  union all

  select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record, v.record->>'assessment_data_type' as item,
      u.family_name, u.given_name, u.session_sub, u.external_analyst
  from ccbc_public.record_version as v
      inner join ccbc_public.ccbc_user u on v.created_by=u.id
  where v.op='INSERT' and v.table_name='assessment_data'
      and v.record->>'application_id'=application.id::varchar(10) and v.record->>'archived_by' is null

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record-> 'json_data' ->>'rfiType' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
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
        u.family_name, u.given_name, u.session_sub, u.external_analyst
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
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
        left join ccbc_public.analyst a on v.record->>'analyst_id' = a.id::varchar(10)
    where v.op='INSERT' and v.table_name='application_analyst_lead' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'package' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_package' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'conditional_approval_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='conditional_approval_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record-> 'json_data' ->>'reason_for_change' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
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
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_gis_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id, v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by = u.id
    where (v.op='INSERT' or v.op='UPDATE') and v.table_name='application_gis_assessment_hh'
        and v.record->>'archived_by' is null and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_announcement' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='project_information_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all

    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where  (v.op='INSERT' or v.op='UPDATE') and v.table_name='change_request_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'history_operation' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.table_name='application_announcement' and v.record->>'history_operation'='deleted'
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_community_progress_report_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_community_progress_report_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)


  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_community_progress_report_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on (v.record->>'updated_by')::integer=u.id
    where v.op='UPDATE' and v.table_name='application_community_progress_report_data' and v.record->>'history_operation'='deleted'
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_claims_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on (v.record->>'updated_by')::integer=u.id
    where v.op='UPDATE' and v.table_name='application_claims_data' and v.record->>'history_operation'='deleted'
        and v.record->>'application_id'=application.id::varchar(10)

  union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_community_claims_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_claims_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_milestone_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_milestone_data' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10)

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_milestone_data' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on (v.record->>'updated_by')::integer=u.id
    where v.op='UPDATE' and v.table_name='application_milestone_data' and v.record->>'history_operation'='deleted'
        and v.record->>'application_id'=application.id::varchar(10)

    union all
    select application.id,  v.created_at, v.op, v.table_name, v.record_id, v.record, v.old_record,
        v.record->>'application_project_type' as item,
        u.family_name, u.given_name, u.session_sub, u.external_analyst
    from ccbc_public.record_version as v
        inner join ccbc_public.ccbc_user u on v.created_by=u.id
    where v.op='INSERT' and v.table_name='application_project_type' and v.record->>'archived_by' is null
        and v.record->>'application_id'=application.id::varchar(10);

$$ language sql stable;

grant execute on function ccbc_public.application_history to ccbc_admin;
grant execute on function ccbc_public.application_history to ccbc_analyst;

comment on function ccbc_public.application_history is 'Computed column that returns list of audit records for application';

commit;
