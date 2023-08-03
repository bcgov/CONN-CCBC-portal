-- Deploy ccbc:tables/application_community_report_data to pg

begin;

create table ccbc_public.application_community_report_data(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  json_data jsonb not null default '{}'::jsonb
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_community_report_data');

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_community_report_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_community_report_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_community_report_data', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_community_report_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_community_report_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_community_report_data', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.application_community_report_data is 'Table containing the Community Report data for the given application';
comment on column ccbc_public.application_community_report_data.id is 'Unique ID for the Community Report data';
comment on column ccbc_public.application_community_report_data.application_id is 'ID of the application this Community Report belongs to';
comment on column ccbc_public.application_community_report_data.json_data is 'The data imported from the Excel filled by the respondent';

commit;
