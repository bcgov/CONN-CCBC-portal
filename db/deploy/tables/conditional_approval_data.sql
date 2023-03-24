-- Deploy ccbc:tables/conditional_approval_data to pg

begin;

create table ccbc_public.conditional_approval_data(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  json_data jsonb not null default '{}'::jsonb);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'conditional_approval_data');
select audit.enable_tracking('ccbc_public.conditional_approval_data'::regclass);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'conditional_approval_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'conditional_approval_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'conditional_approval_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'conditional_approval_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'conditional_approval_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'conditional_approval_data', 'ccbc_admin');

end
$grant$;

comment on table ccbc_public.conditional_approval_data is 'Table to store conditional approval data';

comment on column ccbc_public.conditional_approval_data.id is 'Unique id for the row';

comment on column ccbc_public.conditional_approval_data.application_id is 'The foreign key of an application';

comment on column ccbc_public.conditional_approval_data.json_data is 'The json form data of the conditional approval form';

commit;
