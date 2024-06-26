-- Deploy ccbc:tables/email_record to pg

BEGIN;

create table ccbc_public.email_record(
    id integer primary key generated always as identity,
    to_email varchar(1000),
    cc_email varchar(1000),
    subject varchar(10000),
    body varchar(10000),
    message_id varchar(1000),
    json_data jsonb not null default '{}' :: jsonb
);

select
    ccbc_private.upsert_timestamp_columns('ccbc_public', 'email_record');

grant usage, select on sequence ccbc_public.email_record_id_seq to ccbc_analyst;
grant usage, select on sequence ccbc_public.email_record_id_seq to ccbc_admin;

do $grant$ begin

perform ccbc_private.grant_permissions('select', 'email_record', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'email_record', 'ccbc_admin');

perform ccbc_private.grant_permissions('update', 'email_record', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'email_record', 'ccbc_admin');

perform ccbc_private.grant_permissions('insert', 'email_record', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'email_record', 'ccbc_admin');

perform ccbc_private.upsert_policy(
    'ccbc_admin can always insert',
    'email_record',
    'insert',
    'ccbc_admin',
    'true'
);

perform ccbc_private.upsert_policy(
    'ccbc_analyst can always insert',
    'email_record',
    'insert',
    'ccbc_analyst',
    'true'
);

end $grant$;

comment on table ccbc_public.email_record is 'Table containing list of application email_records';
comment on column ccbc_public.email_record.id is 'Unique ID for each email sent';
comment on column ccbc_public.email_record.to_email is 'Email Address(es) of the recipients';
comment on column ccbc_public.email_record.cc_email is 'Email Address(es) of the CC recipients';
comment on column ccbc_public.email_record.subject is 'Subject of the email';
comment on column ccbc_public.email_record.body is 'Body of the email';
comment on column ccbc_public.email_record.message_id is 'Message ID of the email returned by the email server';
comment on column ccbc_public.email_record.json_data is 'Additional data for the email';

COMMIT;
