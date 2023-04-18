-- Deploy ccbc:tables/announcement to pg

begin;

create table ccbc_public.announcement(
  id integer primary key generated always as identity,
  json_data jsonb not null default '{}'::jsonb
);

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
perform ccbc_private.grant_permissions('select', 'announcement', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'announcement', 'ccbc_admin'); 

end
$grant$;

-- RLS
do
$policy$
begin

perform ccbc_private.upsert_policy('ccbc_analyst_insert_announcement', 
  'announcement', 'insert', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_select_announcement', 
  'announcement', 'select', 'ccbc_analyst', 'true');

-- same for admin
perform ccbc_private.upsert_policy('ccbc_admin_insert_announcement', 
  'announcement', 'insert', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_select_announcement', 
  'announcement', 'select', 'ccbc_admin', 'true');

end
$policy$;


comment on table ccbc_public.announcement is 'Table to  hold the announcement data';

comment on column ccbc_public.form_data.id is 'The unique id of the announcement data';

comment on column ccbc_public.form_data.json_data is 'The data entered into the announcement by the analyst or admin';

commit;
