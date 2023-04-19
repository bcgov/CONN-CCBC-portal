-- Deploy ccbc:tables/announcement to pg

begin;

create table ccbc_public.announcement(
  id integer primary key generated always as identity,
  ccbc_numbers varchar,
  json_data jsonb not null default '{}'::jsonb
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'announcement');
grant usage, select on sequence ccbc_public.announcement_id_seq to ccbc_analyst;
grant usage, select on sequence ccbc_public.announcement_id_seq to ccbc_admin;

-- Enable row-level security
alter table ccbc_public.announcement force row level security;
alter table ccbc_public.announcement enable row level security;

-- enable audit/history
select audit.enable_tracking('ccbc_public.announcement'::regclass);

do
$grant$
begin
perform ccbc_private.grant_permissions('select', 'announcement', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'announcement', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'announcement', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'announcement', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'announcement', 'ccbc_admin'); 
perform ccbc_private.grant_permissions('update', 'announcement', 'ccbc_admin'); 

end
$grant$;

-- RLS
do
$policy$
begin

perform ccbc_private.upsert_policy('ccbc_analyst_insert_announcement', 
  'announcement', 'insert', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_update_announcement', 
  'announcement', 'update', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_select_announcement', 
  'announcement', 'select', 'ccbc_analyst', 'true');

-- same for admin
perform ccbc_private.upsert_policy('ccbc_admin_insert_announcement', 
  'announcement', 'insert', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_update_announcement', 
  'announcement', 'update', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_select_announcement', 
  'announcement', 'select', 'ccbc_admin', 'true');

end
$policy$;


comment on table ccbc_public.announcement is 'Table to  hold the announcement data';

comment on column ccbc_public.announcement.id is 'The unique id of the announcement data';

comment on column ccbc_public.announcement.ccbc_numbers is 'List of CCBC number of the projects included in announcement';

comment on column ccbc_public.announcement.json_data is 'The data entered into the announcement by the analyst or admin';

commit;
