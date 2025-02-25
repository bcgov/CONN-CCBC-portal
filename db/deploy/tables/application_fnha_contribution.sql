-- Deploy ccbc:tables/application_fnha_contribution to pg

BEGIN;

create table ccbc_public.application_fnha_contribution(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  fnha_contribution decimal not null default 0,
  reason_for_change varchar(100)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_fnha_contribution');

-- enable audit/history
select audit.enable_tracking('ccbc_public.application_fnha_contribution'::regclass);

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_fnha_contribution', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_fnha_contribution', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_fnha_contribution', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_fnha_contribution', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_fnha_contribution', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_fnha_contribution', 'ccbc_analyst');

-- Grant cbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_fnha_contribution', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_fnha_contribution', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'application_fnha_contribution', 'cbc_admin');

end
$grant$;

comment on table ccbc_public.application_fnha_contribution is 'Table containing the data about the fnha contribution for the project';
comment on column ccbc_public.application_fnha_contribution.id is 'Unique ID for the row';
comment on column ccbc_public.application_fnha_contribution.application_id is 'The ID of the application';
comment on column ccbc_public.application_fnha_contribution.fnha_contribution is 'The data about the fnha contribution';
comment on column ccbc_public.application_fnha_contribution.reason_for_change is 'The reason for the change';

COMMIT;
