begin;
select plan(6);

-- Table exists
select has_table(
  'ccbc_private', 'connect_session',
  'ccbc_private.connect_session should exist and be a table'
);


-- Columns
select has_column('ccbc_private', 'connect_session', 'sid','The table applications has column sid');
select has_column('ccbc_private', 'connect_session', 'sess','The table applications has column sess');
select has_column('ccbc_private', 'connect_session', 'expire','The table applications has column expire');

select table_privs_are(
  'ccbc_private', 'connect_session', 'ccbc_guest', ARRAY['DELETE', 'INSERT', 'REFERENCES', 'SELECT', 'TRIGGER', 'TRUNCATE', 'UPDATE'],
  'ccbc_guest has all privileges on connect_session table'
);

select table_privs_are(
  'ccbc_private', 'connect_session', 'ccbc_auth_user',  ARRAY['DELETE', 'INSERT', 'REFERENCES', 'SELECT', 'TRIGGER', 'TRUNCATE', 'UPDATE'],
  'ccbc_auth_user has all privileges on connect_session table'
);

select finish();
rollback;
