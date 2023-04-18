-- Deploy ccbc:tables/application_announcement to pg

begin;

create table ccbc_public.application_announcement(
  announcement_id integer references ccbc_public.announcement(id),
  application_id integer references ccbc_public.application(id),
  primary key(announcement_id, application_id)
);

create index application_announcement_announcement_id_idx on ccbc_public.application_announcement(announcement_id);

create index application_announcement_application_id_idx on ccbc_public.application_announcement(application_id);

-- Enable row-level security
alter table ccbc_public.application_announcement force row level security;
alter table ccbc_public.application_announcement enable row level security;

-- enable audit/history
select audit.enable_tracking('ccbc_public.application_announcement'::regclass);

do
$grant$
begin
perform ccbc_private.grant_permissions('select', 'application_announcement', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_announcement', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'application_announcement', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_announcement', 'ccbc_admin'); 

end
$grant$;

-- RLS
do
$policy$
begin

perform ccbc_private.upsert_policy('ccbc_analyst_insert_application_announcement', 
  'application_announcement', 'insert', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_select_application_announcement', 
  'application_announcement', 'select', 'ccbc_analyst', 'true');

-- same for admin

perform ccbc_private.upsert_policy('ccbc_admin_insert_application_announcement', 
  'application_announcement', 'insert', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_select_application_announcement', 
  'application_announcement', 'select', 'ccbc_admin', 'true');

end
$policy$;


comment on table ccbc_public.application_announcement is 'Table to pair an application to RFI data';

comment on column ccbc_public.application_announcement.announcement_id is 'The foreign key of a form';

comment on column ccbc_public.application_announcement.application_id is 'The foreign key of an application';

commit;
