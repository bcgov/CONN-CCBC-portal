-- deploy ccbc:tables/form_type to pg

begin;

create table ccbc_public.form_type(
  name varchar(1000) primary key,
  description varchar(1000)
);

insert into ccbc_public.form_type (name, description) values ('intake', 'Schema for an entire application');
insert into ccbc_public.form_type (name, description) values ('rfi', 'Schema for an RFI');

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'form_type', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'form_type', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('select', 'form_type', 'ccbc_admin');

end
$grant$;

commit;

comment on table ccbc_public.form_type is 'Table containing the different types of forms used in the application';

comment on column ccbc_public.form_type.name is 'Primary key and unique identifier of the type of form';

comment on column ccbc_public.form_type.description is 'Description of the type of form';
