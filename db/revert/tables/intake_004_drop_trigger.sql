-- Revert ccbc:tables/intake_004_drop_trigger from pg

begin;

create trigger set_application_number_seq_name
  before insert on ccbc_public.intake
  for each row
  execute procedure ccbc_private.create_intake_sequence();

commit;
