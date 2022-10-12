-- Deploy ccbc:tables/form_data_status_type to pg

begin;

create table ccbc_public.form_data_status_type(
  name varchar(1000) primary key,
  description varchar(1000)
);

insert into ccbc_public.form_data_status_type values
 ('pending', 'Pending'), ('committed', 'Committed');

do
$$
begin

perform ccbc_private.grant_permissions('select', 'form_data_status_type','ccbc_auth_user');

end
$$;

comment on table ccbc_public.form_data_status_type is 'The statuses applicable to a form';

comment on column ccbc_public.form_data_status_type.name is 'The name of the status type';

comment on column ccbc_public.form_data_status_type.description is 'The description of the status type';

commit;
