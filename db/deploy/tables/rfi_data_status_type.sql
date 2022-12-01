-- Deploy ccbc:tables/rfi_data_status_type to pg

begin;

create table ccbc_public.rfi_data_status_type(
  name varchar(1000) primary key,
  description varchar(1000)
);

insert into ccbc_public.rfi_data_status_type values
 ('draft', 'Draft'), ('sent', 'Sent');

do
$$
begin

perform ccbc_private.grant_permissions('select', 'rfi_data_status_type','ccbc_analyst');

end
$$;

comment on table ccbc_public.rfi_data_status_type is 'The statuses applicable to an RFI';

comment on column ccbc_public.rfi_data_status_type.name is 'The name of the status type';

comment on column ccbc_public.rfi_data_status_type.description is 'The description of the status type';

commit;
