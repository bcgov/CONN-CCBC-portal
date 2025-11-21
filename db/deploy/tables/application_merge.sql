-- Deploy ccbc:tables/application_merge to pg

begin;

create table ccbc_public.application_merge(
  id integer primary key generated always as identity,

  -- exactly one of these two will be set
  parent_application_id integer references ccbc_public.application(id),
  parent_cbc_id         integer references ccbc_public.cbc(id),

  child_application_id integer not null references ccbc_public.application(id),

  -- enforce “either ccbc OR cbc, but not both and not neither”
  constraint application_merge_parent_chk check (
    (parent_application_id is not null and parent_cbc_id is null)
    or
    (parent_application_id is null and parent_cbc_id is not null)
  )
);

select
  ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_merge');

-- enable audit/history
select audit.enable_tracking('ccbc_public.application_merge'::regclass);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'application_merge', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_merge', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_merge', 'ccbc_admin');

perform ccbc_private.grant_permissions('select', 'application_merge', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_merge', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_merge', 'ccbc_analyst');

perform ccbc_private.grant_permissions('select', 'application_merge', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_merge', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'application_merge', 'cbc_admin');

end
$grant$;

comment on table ccbc_public.application_merge is 'Tracks the parent ccbc or cbc application selected when a project is merged';
comment on column ccbc_public.application_merge.parent_application_id is 'Row ID for the parent application (when parent is a ccbc application)';
comment on column ccbc_public.application_merge.parent_cbc_id is 'Row ID for the parent CBC (when parent is a cbc application)';
comment on column ccbc_public.application_merge.child_application_id is 'Row ID for the child application';

commit;
