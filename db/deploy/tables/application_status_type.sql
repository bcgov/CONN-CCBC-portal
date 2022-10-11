-- Deploy ccbc:tables/application_status_type to pg

begin;

create table ccbc_public.application_status_type(
  name varchar(1000) primary key,
  description varchar(1000)
);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'application_status_type', 'ccbc_auth_user');
end
$grant$;

comment on table ccbc_public.application_status_type is 'Table containing the different statuses that can be assigned to an application';

comment on column ccbc_public.application_status_type.name is 'Name of and primary key of the status of an application';

comment on column ccbc_public.application_status_type.description is 'Description of the status type';

insert into ccbc_public.application_status_type (name, description) values
('draft', 'Draft'),
('withdrawn', 'Withdrawn'),
('submitted', 'Submitted'),
('received', 'Received');

COMMIT;
