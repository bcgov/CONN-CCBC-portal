-- deploy ccbc:tables/form to pg

begin;

create table ccbc_public.form(
  id integer primary key generated always as identity,
  slug varchar(1000) unique,
  json_schema jsonb not null default '{}'::jsonb,
  description varchar(1000),
  form_type varchar(1000) references ccbc_public.form_type(name)
);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'form', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'form', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('select', 'form', 'ccbc_admin');
perform ccbc_private.grant_permissions('select', 'form', 'ccbc_job_executor');
perform ccbc_private.grant_permissions('insert', 'form', 'ccbc_job_executor');
perform ccbc_private.grant_permissions('update', 'form', 'ccbc_job_executor');

end
$grant$;

insert into ccbc_public.form (slug, description, form_type) values ('intake1schema', 'Temporary record to be replaced by the app on startup', 'intake');

commit;

comment on table ccbc_public.form is 'Table to hold the json_schema for forms';

comment on column ccbc_public.form.id is 'Primary key on form';

comment on column ccbc_public.form.slug is 'The end url for the form data';

comment on column ccbc_public.form.json_schema is 'The JSON schema for the respective form';

comment on column ccbc_public.form.description is 'Description of the form';
