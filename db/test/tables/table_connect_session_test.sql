set client_min_messages to warning;
create extension if not exists pgtap;
reset client_min_messages;

begin;
SELECT * FROM no_plan();

-- Table exists
select has_table(
  'ccbc_private', 'connect_session',
  'ccbc_private.connect_session should exist, and be a table'
);


-- Columns
select has_column('ccbc_private', 'connect_session', 'sid','The table applications has column sid');
select has_column('ccbc_private', 'connect_session', 'sess','The table applications has column sess');
select has_column('ccbc_private', 'connect_session', 'expire','The table applications has column expire');

select finish();
rollback;
