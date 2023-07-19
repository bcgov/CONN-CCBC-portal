-- Revert ccbc:tables/intake_005_add_description from pg

begin;

alter table ccbc_public.intake drop column if exists description;

commit;
