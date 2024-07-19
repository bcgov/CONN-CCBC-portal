-- Deploy ccbc:tables/application_003_add_program to pg

BEGIN;

alter table ccbc_public.application add column program text DEFAULT 'CCBC' NOT NULL;

comment on column ccbc_public.application.program is 'Program type of the project';

update ccbc_public.application set program = 'OTHER' where ccbc_number like 'BC-%';

COMMIT;
