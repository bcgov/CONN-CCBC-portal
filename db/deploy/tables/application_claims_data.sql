-- Deploy ccbc:tables/application_claims_data to pg

begin;

create table ccbc_public.application_claims_data(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  json_data jsonb not null default '{}'::jsonb
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_claims_data');

create index application_claims_data_application_id_index on ccbc_public.application_claims_data(application_id);
do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_claims_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_claims_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_claims_data', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_claims_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_claims_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_claims_data', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.application_claims_data is 'Table containing the claims data for the given application';
comment on column ccbc_public.application_claims_data.id is 'Unique ID for the claims';
comment on column ccbc_public.application_claims_data.application_id is 'Id of the application the claims belongs to';
comment on column ccbc_public.application_claims_data.json_data is 'The due date, date received and the file information of the claims Excel file';
commit;
