-- Deploy ccbc:tables/application_announced to pg

BEGIN;

create table ccbc_public.application_announced(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  announced boolean default false
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_announced');

create index application_announced_application_id_index on ccbc_public.application_announced(application_id);

-- enable audit/history
select audit.enable_tracking('ccbc_public.application_announced'::regclass);


do
$grant$
begin
perform ccbc_private.grant_permissions('select', 'application_announced', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_announced', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_announced', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'application_announced', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_announced', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_announced', 'ccbc_admin');

end
$grant$;

-- RLS
do
$policy$
begin

perform ccbc_private.upsert_policy('ccbc_analyst_insert_application_announced',
  'application_announced', 'insert', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_select_application_announced',
  'application_announced', 'select', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_update_application_announced',
  'application_announced', 'update', 'ccbc_analyst', 'true');

-- same for admin

perform ccbc_private.upsert_policy('ccbc_admin_insert_application_announced',
  'application_announced', 'insert', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_select_application_announced',
  'application_announced', 'select', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_update_application_announced',
  'application_announced', 'update', 'ccbc_admin', 'true');

end
$policy$;

comment on table ccbc_public.application_announced is 'Table containing if the application has been announced by BC or ISED';
comment on column ccbc_public.application_announced.id is 'Unique ID for the application_announced';
comment on column ccbc_public.application_announced.application_id is 'ID of the application this record belongs to';
comment on column ccbc_public.application_announced.announced is 'Whether the application has been announced by BC or ISED';

COMMIT;
