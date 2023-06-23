-- Deploy ccbc:tables/change_request_data to pg

begin;

create table ccbc_public.change_request_data(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  change_request_number integer not null,
  json_data jsonb not null default '{}'::jsonb);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'change_request_data');
select audit.enable_tracking('ccbc_public.change_request_data'::regclass);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'change_request_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'change_request_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'change_request_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'change_request_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'change_request_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'change_request_data', 'ccbc_admin');

end
$grant$;

comment on table ccbc_public.change_request_data is 'Table to store change request data';

comment on column ccbc_public.change_request_data.id is 'Unique id for the row';

comment on column ccbc_public.change_request_data.application_id is 'The foreign key of an application';

comment on column ccbc_public.change_request_data.change_request_number is 'The change request number for that application';

comment on column ccbc_public.change_request_data.json_data is 'The json form data of the change request form';

commit;
