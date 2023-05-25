-- Deploy ccbc:tables/project_information_data to pg

begin;

create table ccbc_public.project_information_data(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  json_data jsonb not null default '{}'::jsonb);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'project_information_data');
select audit.enable_tracking('ccbc_public.project_information_data'::regclass);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'project_information_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'project_information_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'project_information_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'project_information_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'project_information_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'project_information_data', 'ccbc_admin');

end
$grant$;

comment on table ccbc_public.project_information_data is 'Table to store project information data';

comment on column ccbc_public.project_information_data.id is 'Unique id for the row';

comment on column ccbc_public.project_information_data.application_id is 'The foreign key of an application';

comment on column ccbc_public.project_information_data.json_data is 'The json form data of the project information form';

commit;
