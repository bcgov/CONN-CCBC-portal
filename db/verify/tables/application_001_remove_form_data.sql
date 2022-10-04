-- Verify ccbc:tables/application_001.sql on pg

begin;
do $$
declare
  result integer;
begin
  select count(*) into result from information_schema.columns where column_name = 'form_data' and table_name='application';
  assert result = 0;
end $$;
rollback;
