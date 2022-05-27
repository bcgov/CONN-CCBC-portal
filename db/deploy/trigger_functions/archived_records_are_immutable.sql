-- Deploy ccbc:trigger_functions/archived_records_are_immutable to pg

begin;

create or replace function ccbc_private.archived_records_are_immutable()
returns trigger as $$
begin
  if old.archived_at is not null then
    raise exception 'Deleted records cannot be modified';
  end if;
  return new;
end;
$$ language plpgsql;

grant execute on function ccbc_private.archived_records_are_immutable to ccbc_auth_user;

comment on function ccbc_private.archived_records_are_immutable()
  is $$
  A trigger that raises an exception if changes happen on a record where ''archived_at'' is set.
  $$;


commit;
