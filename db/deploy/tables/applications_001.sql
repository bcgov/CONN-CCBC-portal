-- Deploy ccbc:tables/applications_001 to pg
-- requires: tables/applications

begin;

alter table ccbc_public.application add column last_edited_page varchar(100);

do
$grant$
begin

-- Grant ccbc_auth_user permissions
perform ccbc_private.grant_permissions('select', 'application', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert', 'application', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('update', 'application', 'ccbc_auth_user',
  ARRAY['last_edited_page']);

end
$grant$;

comment on column ccbc_public.application.last_edited_page is 'Column saving the key of the last edited form page';

commit;
