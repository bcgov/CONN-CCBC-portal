-- Deploy ccbc:tables/add_intake_table to pg

BEGIN;

CREATE TABLE ccbc_public.intake(
    id integer primary key generated always as identity,
    open_timestamp timestamp with time zone,
    close_timestamp timestamp with time zone,
    ccbc_intake_number integer
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'intake');
create unique index ccbc_intake_number on ccbc_public.intake(ccbc_intake_number);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'intake', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert', 'intake', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('update', 'intake', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('select', 'intake', 'ccbc_guest');

end
$grant$;

comment on table ccbc_public.intake is 'Table contianing intake numbers and their respective open and closing dates';
comment on column ccbc_public.intake.id is 'Unique ID for each intake number';
comment on column ccbc_public.intake.open_timestamp is 'Open date and time for an intake number';
comment on column ccbc_public.intake.close_timestamp is 'Close date and time for an intake number';
comment on column ccbc_public.intake.ccbc_intake_number is 'Unique intake number for a set of CCBC IDs';

COMMIT;
