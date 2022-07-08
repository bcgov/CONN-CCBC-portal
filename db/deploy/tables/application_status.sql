-- Deploy ccbc:tables/application_status to pg

begin;

create table ccbc_public.application_status(
  id integer primary key generated always as identity,
  name varchar(1000) not null,
  description varchar(10000)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_status');
create unique index application_status_name on ccbc_public.application_status(name);

do
$grant$
begin

-- Grant ccbc_auth_user permissions
perform ccbc_private.grant_permissions('select', 'application_status', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert', 'application_status', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('update', 'application_status', 'ccbc_auth_user');

end
$grant$;

comment on table ccbc_public.application_status is 'Table containing information about possible application statuses';
comment on column ccbc_public.application_status.id is 'Unique ID for the application_status';
comment on column ccbc_public.application_status.name is 'Name of the application_status';
comment on column ccbc_public.application_status.description is 'Description of the application_status';

insert into ccbc_public.application_status (name, description) values
('Draft', 'Draft'),
('Withdrawn', 'Withdrawn'),
('Complete', 'Complete'),
('Under Review', 'Under Review');

commit;
