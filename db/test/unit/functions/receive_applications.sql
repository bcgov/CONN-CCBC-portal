begin;

select plan(1);

select has_function(
  'ccbc_public', 'receive_applications',
  'Function receive_applications should exist'
);

select finish();

rollback;
