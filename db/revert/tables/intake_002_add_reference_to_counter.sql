-- revert ccbc:tables/intake_002_add_reference_to_counter from pg

begin;

alter table ccbc_public.intake drop column counter_id;

commit;
