-- Deploy ccbc:trigger_functions/create_intake_sequence to pg

begin;

create or replace function ccbc_private.create_intake_sequence()
returns trigger as $$

begin
  new.application_number_seq_name = concat('ccbc_public.intake_', new.ccbc_intake_number, '_application_number_seq');
  execute('create sequence ' || new.application_number_seq_name || ' owned by ccbc_public.intake.application_number_seq_name;');
  return new;
end;
$$ language plpgsql;

grant execute on function ccbc_private.create_intake_sequence to ccbc_auth_user;

commit;
