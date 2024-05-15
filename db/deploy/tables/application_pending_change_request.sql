-- Deploy ccbc:tables/application_pending_change_request to pg

BEGIN;

create table ccbc_public.application_pending_change_request(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  is_pending boolean default false,
  comment varchar(100)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_pending_change_request');

-- enable audit/history
select audit.enable_tracking('ccbc_public.application_pending_change_request'::regclass);

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_pending_change_request', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_pending_change_request', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_pending_change_request', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_pending_change_request', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_pending_change_request', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_pending_change_request', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.application_pending_change_request is 'Table containing the pending change request details of the application';
comment on column ccbc_public.application_pending_change_request.id is 'Unique ID for the application_pending_change_request';
comment on column ccbc_public.application_pending_change_request.application_id is 'ID of the application this application_pending_change_request belongs to';
comment on column ccbc_public.application_pending_change_request.is_pending is 'Column defining if the change request pending or not';
comment on column ccbc_public.application_pending_change_request.comment is 'Column containing the comment for the change request or completion of the change request';

COMMIT;
