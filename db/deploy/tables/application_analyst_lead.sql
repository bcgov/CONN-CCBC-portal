-- Deploy ccbc:tables/application_analyst_lead to pg

begin;

create table ccbc_public.application_analyst_lead(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  analyst_id integer references ccbc_public.analyst(id)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_analyst_lead');

create index application_analyst_lead_application_id_index on ccbc_public.application_analyst_lead(application_id);
do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_analyst_lead', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_analyst_lead', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_analyst_lead', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_analyst_lead', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.application_analyst_lead is 'Table containing the analyst lead for the given application';
comment on column ccbc_public.application_analyst_lead.id is 'Unique ID for the application_analyst_lead';
comment on column ccbc_public.application_analyst_lead.application_id is 'ID of the application this analyst lead belongs to';
comment on column ccbc_public.application_analyst_lead.analyst_id is 'ID of the analyst this analyst lead belongs to';

commit;
