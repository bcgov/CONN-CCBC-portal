-- Deploy ccbc:application_002_add_internal_description to pg

begin;

alter table ccbc_public.application add column internal_description text;

comment on column ccbc_public.application.internal_description is 'Internal project description for analysts';

commit;
