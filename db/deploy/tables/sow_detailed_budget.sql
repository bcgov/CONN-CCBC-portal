-- Deploy ccbc:tables/sow_detailed_budget to pg

begin;

create table ccbc_public.sow_detailed_budget(
  id integer primary key generated always as identity,
  sow_id integer references ccbc_public.application_sow_data(id),
  direct_labour_costs varchar(1000),
  description_of_labour varchar(1000),
  additional_comments varchar(1000),
  rural_broadband float(2) default null,
  very_remote_broadband float(2) default null,
  mobile float(2) default null,
  total_amount float(2) default null
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'sow_detailed_budget');

create index sow_detailed_budget_sow_id_index on ccbc_public.sow_detailed_budget(sow_id);
do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'sow_detailed_budget', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'sow_detailed_budget', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'sow_detailed_budget', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'sow_detailed_budget', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.sow_detailed_budget is 'Table containing the detailed budget data for the given SoW';
comment on column ccbc_public.sow_detailed_budget.id is 'Unique ID for the SoW detailed budget record';
comment on column ccbc_public.sow_detailed_budget.sow_id is 'ID of the SoW';
comment on column ccbc_public.sow_detailed_budget.direct_labour_costs is 'Direct labour costs';
comment on column ccbc_public.sow_detailed_budget.description_of_labour is 'Description of labour';
comment on column ccbc_public.sow_detailed_budget.additional_comments is 'Additional comments';
comment on column ccbc_public.sow_detailed_budget.rural_broadband is 'Rural, broadband';
comment on column ccbc_public.sow_detailed_budget.very_remote_broadband is 'Very remote/satellite/indigenous broadband';
comment on column ccbc_public.sow_detailed_budget.mobile is 'Mobile';
comment on column ccbc_public.sow_detailed_budget.total_amount is 'Total amount';

commit;

