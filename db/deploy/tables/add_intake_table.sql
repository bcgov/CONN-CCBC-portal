-- Deploy ccbc:tables/add_intake_table to pg

begin;

create table ccbc_public.intake(
  id integer primary key generated always as identity,
  open_timestamp timestamp with time zone not null,
  close_timestamp timestamp with time zone not null,
  ccbc_intake_number integer unique not null,
  application_number_seq_name varchar(1000) unique
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'intake');

create trigger set_application_number_seq_name
  before insert on ccbc_public.intake
  for each row
  execute procedure ccbc_private.create_intake_sequence();

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values ('2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 1);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'intake', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('select', 'intake', 'ccbc_guest');

end
$grant$;

comment on table ccbc_public.intake is 'Table contianing intake numbers and their respective open and closing dates';
comment on column ccbc_public.intake.id is 'Unique ID for each intake number';
comment on column ccbc_public.intake.open_timestamp is 'Open date and time for an intake number';
comment on column ccbc_public.intake.close_timestamp is 'Close date and time for an intake number';
comment on column ccbc_public.intake.ccbc_intake_number is 'Unique intake number for a set of CCBC IDs';
comment on column ccbc_public.intake.application_number_seq_name is 'The name of the sequence used to generate CCBC ids. It is added via a trigger';

commit;
