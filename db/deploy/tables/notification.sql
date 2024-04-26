-- Deploy ccbc:tables/notification to pg

BEGIN;


create table ccbc_public.notification(
    id integer primary key generated always as identity,
    notification_type varchar(1000),
    application_id integer references ccbc_public.application(id),
    json_data jsonb not null default '{}' :: jsonb,
    email_record_id integer references ccbc_public.email_record(id)
);

select
    ccbc_private.upsert_timestamp_columns('ccbc_public', 'notification');

grant usage, select on sequence ccbc_public.notification_id_seq to ccbc_analyst;
grant usage, select on sequence ccbc_public.notification_id_seq to ccbc_admin;

do $grant$ begin

perform ccbc_private.grant_permissions('select', 'notification', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'notification', 'ccbc_admin');

perform ccbc_private.grant_permissions('update', 'notification', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'notification', 'ccbc_admin');

perform ccbc_private.grant_permissions('insert', 'notification', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'notification', 'ccbc_admin');

perform ccbc_private.upsert_policy(
    'ccbc_admin can always insert',
    'notification',
    'insert',
    'ccbc_admin',
    'true'
);

perform ccbc_private.upsert_policy(
    'ccbc_analyst can always insert',
    'notification',
    'insert',
    'ccbc_analyst',
    'true'
);

end $grant$;

comment on table ccbc_public.notification is 'Table containing list of application notifications';
comment on column ccbc_public.notification.id is 'Unique ID for each notification';
comment on column ccbc_public.notification.notification_type is 'Type of the notification';
comment on column ccbc_public.notification.application_id is 'ID of the application this notification belongs to';
comment on column ccbc_public.notification.json_data is 'Additional data for the notification';
comment on column ccbc_public.notification.email_record_id is 'Column referencing the email record';

COMMIT;
