-- Deploy ccbc:tables/application_rd_001 to pg

begin;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'ccbc_public' and table_name = 'application_rd' and column_name = 'id'
  ) then
    alter table ccbc_public.application_rd add column id serial primary key;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'ccbc_public' and table_name = 'application_rd' and column_name = 'er'
  ) then
    alter table ccbc_public.application_rd add column er text;
  end if;
end $$;

alter table ccbc_public.application_rd
  alter column ccbc_number type text,
  alter column rd type text;

commit;
