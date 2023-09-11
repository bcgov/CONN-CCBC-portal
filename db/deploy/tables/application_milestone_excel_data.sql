-- Deploy ccbc:tables/application_milestone_excel_data to pg

begin;

create table ccbc_public.application_milestone_excel_data(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  json_data jsonb not null default '{}'::jsonb
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_milestone_excel_data');

-- enable audit/history
select audit.enable_tracking('ccbc_public.application_milestone_excel_data'::regclass);

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_milestone_excel_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_milestone_excel_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_milestone_excel_data', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_milestone_excel_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_milestone_excel_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_milestone_excel_data', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.application_milestone_excel_data is 'Table containing the milestone excel data for the given application';
comment on column ccbc_public.application_milestone_excel_data.id is 'Unique ID for the milestone excel data';
comment on column ccbc_public.application_milestone_excel_data.application_id is 'ID of the application this data belongs to';
comment on column ccbc_public.application_milestone_excel_data.json_data is 'The data imported from the excel filled by the respondent';

commit;
