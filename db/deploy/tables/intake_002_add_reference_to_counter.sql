-- deploy ccbc:tables/intake_002_add_reference_to_counter to pg

begin;

alter table ccbc_public.intake add column counter_id int references ccbc_public.gapless_counter(id);

commit;
