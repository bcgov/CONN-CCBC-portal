-- Deploy ccbc:tables/applications to pg
-- requires: schemas/public

begin;

create table if not exists ccbc_public.applications (
  id integer primary key generated always as identity,
  reference_number varchar(1000),
  owner uuid,
  form_data jsonb not null default '{}'::jsonb,
  status varchar(1000) default 'draft',
  unique(owner)
);

commit;
