-- Deploy ccbc:tables/application_er_001 to pg

begin;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'ccbc_public' and table_name = 'application_er' and column_name = 'id'
  ) then
    alter table ccbc_public.application_er add column id serial primary key;
  end if;
end $$;

alter table ccbc_public.application_er
  alter column ccbc_number type text,
  alter column er type text;

commit;
