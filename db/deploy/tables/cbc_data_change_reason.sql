-- Deploy ccbc:tables/cbc_data_change_reason to pg

begin;

create table ccbc_public.cbc_data_change_reason (
    id serial primary key,
    cbc_data_id integer not null references ccbc_public.cbc_data(id),
    description text
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'cbc_data_change_reason');
select audit.enable_tracking('ccbc_public.cbc_data_change_reason'::regclass);


grant all on sequence ccbc_public.cbc_data_change_reason_id_seq to cbc_admin;

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'cbc_data_change_reason', 'ccbc_admin');
perform ccbc_private.grant_permissions('select', 'cbc_data_change_reason', 'ccbc_analyst');

perform ccbc_private.grant_permissions('select', 'cbc_data_change_reason', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'cbc_data_change_reason', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'cbc_data_change_reason', 'cbc_admin');

end
$grant$;


comment on table ccbc_public.cbc_data_change_reason is 'Table containing the reasons for changes to cbc_data';
comment on column ccbc_public.cbc_data_change_reason.id is 'Unique ID for the cbc_data_change_reason';
comment on column ccbc_public.cbc_data_change_reason.cbc_data_id is 'ID of the cbc_data this cbc_data_change_reason belongs to';
comment on column ccbc_public.cbc_data_change_reason.description is 'The reason for the change to the cbc_data';


commit;
