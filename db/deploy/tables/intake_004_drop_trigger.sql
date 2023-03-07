-- Deploy ccbc:tables/intake_004_drop_trigger to pg

begin;

drop trigger if exists set_application_number_seq_name on ccbc_public.intake;

commit;
