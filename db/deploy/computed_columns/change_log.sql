-- Deploy ccbc:computed_columns/change_log to pg

begin;

create or replace function ccbc_public.change_log()
returns setof ccbc_public.record_version as $$

  -- Application table (INSERT only)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application'

  union all

  -- Application status (INSERT only)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_status'

  union all

  -- Attachment (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='attachment' and r.record->>'archived_by' is null

  union all

  -- Assessment data (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='assessment_data' and r.record->>'archived_by' is null

  union all

  -- RFI data (INSERT, not archived, with application relationship)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='rfi_data' and r.record->>'archived_by' is null
    and r.record->>'id' in (
      select rd.id::varchar(10) from ccbc_public.rfi_data as rd
      inner join ccbc_public.application_rfi_data arf on arf.rfi_data_id = rd.id
    )

  union all

  -- RFI data (UPDATE, not archived, with application relationship, use updated_by)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         COALESCE((r.record->>'updated_by')::int, r.created_by) as created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='UPDATE' and r.table_name='rfi_data' and r.record->>'archived_by' is null
    and r.record->>'id' in (
      select rd.id::varchar(10) from ccbc_public.rfi_data as rd
      inner join ccbc_public.application_rfi_data arf on arf.rfi_data_id = rd.id
    )

  union all

  -- Application analyst lead (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_analyst_lead' and r.record->>'archived_by' is null

  union all

  -- Application package (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_package' and r.record->>'archived_by' is null

  union all

  -- Conditional approval data (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='conditional_approval_data' and r.record->>'archived_by' is null

  union all

  -- Form data (INSERT only, not archived, intake forms only)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='form_data' and r.record->>'archived_by' is null
    and r.record->>'id' in (
      select fd.id::varchar(10) from ccbc_public.form_data as fd,
          ccbc_public.form as f, ccbc_public.application_form_data as af
      where fd.form_schema_id = f.id and f.form_type = 'intake'
        and fd.id = af.form_data_id
    )

  union all

  -- Application GIS data (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_gis_data' and r.record->>'archived_by' is null

  union all

  -- Application GIS assessment HH (INSERT or UPDATE, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where (r.op='INSERT' or r.op='UPDATE') and r.table_name='application_gis_assessment_hh'
    and r.record->>'archived_by' is null

  union all

  -- Application announced (INSERT or UPDATE, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where (r.op='INSERT' or r.op='UPDATE') and r.table_name='application_announced'
    and r.record->>'archived_by' is null

  union all

  -- Application announcement (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_announcement' and r.record->>'archived_by' is null

  union all

  -- Application announcement (deleted records, use updated_by)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         COALESCE((r.record->>'updated_by')::int, r.created_by) as created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.table_name='application_announcement' and r.record->>'history_operation'='deleted'

  union all

  -- Project information data (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='project_information_data' and r.record->>'archived_by' is null

  union all

  -- Application SOW data (INSERT only)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_sow_data'

  union all

  -- Change request data (INSERT or UPDATE)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where (r.op='INSERT' or r.op='UPDATE') and r.table_name='change_request_data'

  union all

  -- Application community progress report data (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_community_progress_report_data'
    and r.record->>'archived_by' is null

  union all

  -- Application community progress report data (UPDATE deleted, use updated_by)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         COALESCE((r.record->>'updated_by')::int, r.created_by) as created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='UPDATE' and r.table_name='application_community_progress_report_data'
    and r.record->>'history_operation'='deleted'

  union all

  -- Application claims data (UPDATE deleted, use updated_by)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         COALESCE((r.record->>'updated_by')::int, r.created_by) as created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='UPDATE' and r.table_name='application_claims_data'
    and r.record->>'history_operation'='deleted'

  union all

  -- Application claims data (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_claims_data' and r.record->>'archived_by' is null

  union all

  -- Application milestone data (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_milestone_data' and r.record->>'archived_by' is null

  union all

  -- Application milestone data (UPDATE deleted, use updated_by)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         COALESCE((r.record->>'updated_by')::int, r.created_by) as created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='UPDATE' and r.table_name='application_milestone_data'
    and r.record->>'history_operation'='deleted'

  union all

  -- Application project type (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_project_type' and r.record->>'archived_by' is null

  union all

  -- Application dependencies (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_dependencies' and r.record->>'archived_by' is null

  union all

  -- Application dependencies (UPDATE, not archived, use updated_by)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         COALESCE((r.record->>'updated_by')::int, r.created_by) as created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='UPDATE' and r.table_name='application_dependencies' and r.record->>'archived_by' is null

  union all

  -- Application RD (INSERT only, not archived, grouped)
  select r.id, (array_agg(r.record_id))[1] as record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema,
         'application_communities' as table_name, r.created_by, r.created_at,
         jsonb_build_object('application_rd', jsonb_agg(jsonb_build_object('er', r.record->'er', 'rd', r.record->'rd'))) as record,
         jsonb_agg(r.old_record) as old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_rd' and r.record->>'archived_by' is null
  group by r.id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.created_by, r.created_at

  union all

  -- Application FNHA contribution (INSERT or UPDATE, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where (r.op='INSERT' or r.op='UPDATE') and r.table_name='application_fnha_contribution'
    and r.record->>'archived_by' is null

  union all

  -- Application pending change request (INSERT only, not archived)
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
         r.created_by, r.created_at, r.record, r.old_record
  from ccbc_public.record_version as r
  where r.op='INSERT' and r.table_name='application_pending_change_request'
    and r.record->>'archived_by' is null

  union all

  -- CBC data with enhanced community information
  select r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name,
    case when r.op = 'UPDATE'::audit.operation
         then COALESCE((r.record->>'updated_by')::int, r.created_by)
         else r.created_by
    end as created_by,
    r.created_at,
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
          and community.created_by = r.created_by
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
          and community.created_by = r.created_by
          and community.table_name = 'cbc_project_communities'
          and community.op = 'UPDATE'
      )
    ) as record,
    r.old_record
  from ccbc_public.record_version as r
  where r.table_name = 'cbc_data'

  -- Order by newest modifications first
  order by
    COALESCE(record->>'updated_at', created_at::text, ts::text) desc,
    id desc;

$$ language sql stable;

grant execute on function ccbc_public.change_log to ccbc_admin;
grant execute on function ccbc_public.change_log to cbc_admin;
grant execute on function ccbc_public.change_log to ccbc_analyst;

comment on function ccbc_public.change_log is 'Get all change log records ordered by newest modifications first, independent of application or CBC ID';

commit;
