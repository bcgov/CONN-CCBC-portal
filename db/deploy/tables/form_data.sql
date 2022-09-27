-- deploy ccbc:tables/form_data to pg

begin;

create table ccbc_public.form_data(
  id integer primary key generated always as identity,
  form_data jsonb not null default '{}'::jsonb
);
select ccbc_private.upsert_timestamp_columns('ccbc_public', 'form_data');

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'form_data', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert', 'form_data', 'ccbc_auth_user');
end
$grant$;

comment on table ccbc_public.form_data is 'Table to hold applicant form data';

comment on column ccbc_public.form_data.id is 'The unique id of the form data';

comment on column ccbc_public.form_data.form_data is 'The unique id of the form data';

commit;
