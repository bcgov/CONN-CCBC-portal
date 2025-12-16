-- Deploy ccbc:tables/application_internal_notes to pg

begin;

create table ccbc_public.application_internal_notes (
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  note text
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_internal_notes');

GRANT TRIGGER ON ccbc_public.application_internal_notes TO ccbc;
select audit.enable_tracking('ccbc_public.application_internal_notes'::regclass);

do
$grant$
begin

  perform ccbc_private.grant_permissions('select', 'application_internal_notes', 'ccbc_admin');
  perform ccbc_private.grant_permissions('insert', 'application_internal_notes', 'ccbc_admin');
  perform ccbc_private.grant_permissions('update', 'application_internal_notes', 'ccbc_admin');

  perform ccbc_private.grant_permissions('select', 'application_internal_notes', 'ccbc_analyst');

  perform ccbc_private.grant_permissions('select', 'application_internal_notes', 'super_admin');
  perform ccbc_private.grant_permissions('insert', 'application_internal_notes', 'super_admin');
  perform ccbc_private.grant_permissions('update', 'application_internal_notes', 'super_admin');

end
$grant$;

comment on table ccbc_public.application_internal_notes is 'Table containing internal notes for the application';
comment on column ccbc_public.application_internal_notes.id is 'Primary key for the internal notes record';
comment on column ccbc_public.application_internal_notes.application_id is 'Application that owns the internal notes';
comment on column ccbc_public.application_internal_notes.note is 'The internal notes text';

commit;
