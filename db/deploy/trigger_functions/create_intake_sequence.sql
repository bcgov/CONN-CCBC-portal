-- Deploy ccbc:trigger_functions/create_intake_sequence to pg

begin;

create or replace function ccbc_private.create_intake_sequence()
returns trigger as $$

begin
  new.application_number_seq_name = concat('ccbc_public.intake_', new.ccbc_intake_number, '_application_number_seq');
  execute('create sequence if not exists ' || new.application_number_seq_name || ' owned by ccbc_public.intake.application_number_seq_name;');
  execute('grant usage, select on sequence ' || new.application_number_seq_name || ' to ccbc_auth_user;');
  return new;
end;
$$ language plpgsql;

grant execute on function ccbc_private.create_intake_sequence to ccbc_auth_user;

commit;
