-- Deploy ccbc:tables/application_internal_description to pg

begin;

alter table ccbc_public.application drop column if exists internal_description;

create table ccbc_public.application_internal_description(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  description text
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_internal_description');

-- enable audit/history
select audit.enable_tracking('ccbc_public.application_internal_description'::regclass);

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_internal_description', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_internal_description', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_internal_description', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_internal_description', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_internal_description', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_internal_description', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.application_internal_description is 'Table containing the internal description for the given application';
comment on column ccbc_public.application_internal_description.id is 'Unique id for the row';
comment on column ccbc_public.application_internal_description.application_id is 'Id of the application the description belongs to';
comment on column ccbc_public.application_internal_description.description is 'The internal description for the given application';

commit;
