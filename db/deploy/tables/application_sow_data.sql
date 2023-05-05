-- Deploy ccbc:tables/application_sow_data to pg

begin;

create table ccbc_public.application_sow_data(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  total_eligible_cost float(2) default null,
  total_ineligible_cost float(2) default null,
  total_project_cost float(2) default null,
  effective_start_date timestamptz,
  project_start_date timestamptz,
  project_completion_date timestamptz
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_sow_data');

create index application_sow_data_application_id_index on ccbc_public.application_sow_data(application_id);
do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_sow_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_sow_data', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_sow_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_sow_data', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.application_sow_data is 'Table containing the SoW data for the given application';
comment on column ccbc_public.application_sow_data.id is 'Unique ID for the  SoW';
comment on column ccbc_public.application_sow_data.application_id is 'ID of the application this SoW belongs to';

commit;
