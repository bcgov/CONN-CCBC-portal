-- Deploy ccbc:computed_columns/change_log to pg

begin;

create or replace function ccbc_public.change_log(limit_count integer default null, offset_count integer default 0)
returns setof ccbc_public.change_log_record as $$

  select
    r.id,
    r.record_id,
    r.old_record_id,
    r.op,
    r.ts,
    r.table_oid,
    r.table_schema,
    r.table_name,
    -- Use updated_by for specific cases, otherwise created_by
    case
      when (r.op='UPDATE' and r.table_name in ('rfi_data', 'application_announcement', 'application_community_progress_report_data', 'application_claims_data', 'application_milestone_data', 'application_dependencies'))
           or (r.table_name='application_announcement' and r.record->>'history_operation'='deleted')
           or (r.op = 'UPDATE' and r.table_name = 'cbc_data')
      then COALESCE((r.record->>'updated_by')::int, r.created_by)
      else r.created_by
    end as created_by,
    r.created_at,
    -- Add CCBC number and application ID for non-CBC data
    case
      when r.table_name != 'cbc_data' then app.ccbc_number
      else null
    end as ccbc_number,
    case
      when r.table_name != 'cbc_data' then
        case
          when r.table_name = 'rfi_data' then rfi_app.application_id
          else app.id
        end
      else null
    end as application_id,
    case
      when r.table_name != 'cbc_data' then app.program
      else null
    end as program,
    -- Enhanced record for CBC data, regular record for others, all with user info
    case
      when r.table_name = 'cbc_data' then
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
              and community.created_by = (
                case
                  when r.op = 'UPDATE'::audit.operation
                  then COALESCE((r.record->>'updated_by')::int, r.created_by)
                  else r.created_by
                end
              )
              and community.table_name = 'cbc_project_communities'
              and community.op = 'INSERT'
              and (community.record->>'cbc_id')::int = (r.record->>'cbc_id')::int
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
              and community.table_name = 'cbc_project_communities'
              and community.op = 'UPDATE'
              and (community.record->>'cbc_id')::int = (r.record->>'cbc_id')::int
          ),
          'user_info', jsonb_build_object(
            'family_name', COALESCE(u.family_name, 'Automated process'),
            'given_name', COALESCE(u.given_name, ''),
            'session_sub', COALESCE(u.session_sub, 'robot@idir'),
            'external_analyst', u.external_analyst
          )
        )
      when r.table_name = 'application_rd' then
        jsonb_build_object(
          'application_rd', jsonb_agg(jsonb_build_object('er', r.record->'er', 'rd', r.record->'rd')),
          'user_info', jsonb_build_object(
            'family_name', COALESCE(u.family_name, 'Automated process'),
            'given_name', COALESCE(u.given_name, ''),
            'session_sub', COALESCE(u.session_sub, 'robot@idir'),
            'external_analyst', u.external_analyst
          )
        )
      else r.record || jsonb_build_object(
        'user_info', jsonb_build_object(
          'family_name', COALESCE(u.family_name, 'Automated process'),
          'given_name', COALESCE(u.given_name, ''),
          'session_sub', COALESCE(u.session_sub, 'robot@idir'),
          'external_analyst', u.external_analyst
        )
      )
    end as record,
    r.old_record
  from ccbc_public.record_version as r
  -- Join with ccbc_user based on the attribution logic
  left join ccbc_public.ccbc_user u on u.id = (
    case
      when (r.op='UPDATE' and r.table_name in ('rfi_data', 'application_announcement', 'application_community_progress_report_data', 'application_claims_data', 'application_milestone_data', 'application_dependencies'))
           or (r.table_name='application_announcement' and r.record->>'history_operation'='deleted')
           or (r.op = 'UPDATE' and r.table_name = 'cbc_data')
      then COALESCE((r.record->>'updated_by')::int, r.created_by)
      else r.created_by
    end
  )
  -- Join with application for CCBC number (not for cbc_data)
  left join ccbc_public.application app on (
    r.table_name != 'cbc_data' and (
      -- Direct application_id reference
      (r.record->>'application_id')::int = app.id
      or
      -- For tables that reference application through other means
      case
        when r.table_name = 'application' then (r.record->>'id')::int = app.id
        when r.table_name = 'application_status' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'assessment_data' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_analyst_lead' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_package' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'conditional_approval_data' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_gis_data' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_gis_assessment_hh' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_announced' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_announcement' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'project_information_data' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_sow_data' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'change_request_data' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_community_progress_report_data' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_claims_data' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_milestone_data' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_project_type' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_dependencies' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_rd' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_fnha_contribution' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_pending_change_request' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'application_internal_notes' then (r.record->>'application_id')::int = app.id
        when r.table_name = 'form_data' then
          (r.record->>'id')::int in (
            select af.form_data_id from ccbc_public.application_form_data af where af.application_id = app.id
          )
        when r.table_name = 'rfi_data' then
          (r.record->>'id')::int in (
            select arf.rfi_data_id from ccbc_public.application_rfi_data arf where arf.application_id = app.id
          )
        else false
      end
    )
  )
  -- Special join for rfi_data to get application_id through application_rfi_data
  left join ccbc_public.application_rfi_data rfi_app on (
    r.table_name = 'rfi_data' and rfi_app.rfi_data_id = (r.record->>'id')::int
  )
  where
    -- Application table (INSERT only)
    (r.op='INSERT' and r.table_name='application')
    or
    -- Application status (INSERT only)
    (r.op='INSERT' and r.table_name='application_status')
    or
    -- Assessment data (INSERT only, not archived)
    (r.op='INSERT' and r.table_name='assessment_data' and r.record->>'archived_by' is null)
    or
    -- RFI data (INSERT/UPDATE, not archived, with application relationship)
    ((r.op='INSERT' or r.op='UPDATE') and r.table_name='rfi_data' and r.record->>'archived_by' is null
     and r.record->>'id' in (
       select rd.id::varchar(10) from ccbc_public.rfi_data as rd
       inner join ccbc_public.application_rfi_data arf on arf.rfi_data_id = rd.id
     ))
    or
    -- Application analyst lead (INSERT only, not archived)
    (r.op='INSERT' and r.table_name='application_analyst_lead' and r.record->>'archived_by' is null)
    or
    -- Application package (INSERT only, not archived)
    (r.op='INSERT' and r.table_name='application_package' and r.record->>'archived_by' is null)
    or
    -- Conditional approval data (INSERT only, not archived)
    (r.op='INSERT' and r.table_name='conditional_approval_data' and r.record->>'archived_by' is null)
    or
    -- Form data (INSERT only, not archived, intake forms only)
    (r.op='INSERT' and r.table_name='form_data' and r.record->>'archived_by' is null
     and r.record->>'id' in (
       select fd.id::varchar(10) from ccbc_public.form_data as fd,
           ccbc_public.form as f, ccbc_public.application_form_data as af
       where fd.form_schema_id = f.id and f.form_type = 'intake'
         and fd.id = af.form_data_id
     ))
    or
    -- Application GIS data (INSERT only, not archived)
    (r.op='INSERT' and r.table_name='application_gis_data' and r.record->>'archived_by' is null)
    or
    -- Application GIS assessment HH (INSERT or UPDATE, not archived)
    ((r.op='INSERT' or r.op='UPDATE') and r.table_name='application_gis_assessment_hh' and r.record->>'archived_by' is null)
    or
    -- Application announced (INSERT or UPDATE, not archived)
    ((r.op='INSERT' or r.op='UPDATE') and r.table_name='application_announced' and r.record->>'archived_by' is null)
    or
    -- Application announcement (INSERT only, not archived OR deleted records)
    ((r.op='INSERT' and r.table_name='application_announcement' and r.record->>'archived_by' is null)
     or (r.table_name='application_announcement' and r.record->>'history_operation'='deleted'))
    or
    -- Project information data (INSERT only, not archived)
    (r.op='INSERT' and r.table_name='project_information_data' and r.record->>'archived_by' is null)
    or
    -- Application SOW data (INSERT only)
    (r.op='INSERT' and r.table_name='application_sow_data')
    or
    -- Change request data (INSERT or UPDATE)
    ((r.op='INSERT' or r.op='UPDATE') and r.table_name='change_request_data')
    or
    -- Application community progress report data (INSERT only, not archived OR UPDATE deleted)
    ((r.op='INSERT' and r.table_name='application_community_progress_report_data' and r.record->>'archived_by' is null)
     or (r.op='UPDATE' and r.table_name='application_community_progress_report_data' and r.record->>'history_operation'='deleted'))
    or
    -- Application claims data (INSERT only, not archived OR UPDATE deleted)
    ((r.op='INSERT' and r.table_name='application_claims_data' and r.record->>'archived_by' is null)
     or (r.op='UPDATE' and r.table_name='application_claims_data' and r.record->>'history_operation'='deleted'))
    or
    -- Application milestone data (INSERT only, not archived OR UPDATE deleted)
    ((r.op='INSERT' and r.table_name='application_milestone_data' and r.record->>'archived_by' is null)
     or (r.op='UPDATE' and r.table_name='application_milestone_data' and r.record->>'history_operation'='deleted'))
    or
    -- Application project type (INSERT only, not archived)
    (r.op='INSERT' and r.table_name='application_project_type' and r.record->>'archived_by' is null)
    or
    -- Application dependencies (INSERT/UPDATE, not archived)
    ((r.op='INSERT' or r.op='UPDATE') and r.table_name='application_dependencies' and r.record->>'archived_by' is null)
    or
    -- Application RD (INSERT only, not archived)
    (r.op='INSERT' and r.table_name='application_rd' and r.record->>'archived_by' is null)
    or
    -- Application FNHA contribution (INSERT or UPDATE, not archived)
    ((r.op='INSERT' or r.op='UPDATE') and r.table_name='application_fnha_contribution' and r.record->>'archived_by' is null)
    or
    -- Application pending change request (INSERT only, not archived)
    (r.op='INSERT' and r.table_name='application_pending_change_request' and r.record->>'archived_by' is null)
    or
    -- Application internal notes (INSERT or UPDATE)
    ((r.op='INSERT' or r.op='UPDATE') and r.table_name='application_internal_notes' and r.record->>'archived_by' is null and r.record->>'application_id' is not null)
    or
    -- CBC data (all operations)
    (r.table_name = 'cbc_data')
  and (
    -- Exclude records with null ccbc_number for non-cbc_data tables
    r.table_name = 'cbc_data' or app.ccbc_number is not null
  )
  group by r.id, r.record_id, r.old_record_id, r.op, r.ts, r.table_oid, r.table_schema, r.table_name, r.created_by, r.created_at, r.record, r.old_record, u.family_name, u.given_name, u.session_sub, u.external_analyst, app.ccbc_number, app.id, app.program, rfi_app.application_id
  order by r.id desc
  limit coalesce(limit_count, 2147483647)
  offset offset_count;

$$ language sql stable;

grant execute on function ccbc_public.change_log to ccbc_admin;
grant execute on function ccbc_public.change_log to cbc_admin;
grant execute on function ccbc_public.change_log to ccbc_analyst;

comment on function ccbc_public.change_log is 'Get all change log records ordered by newest modifications first, independent of application or CBC ID';

commit;
