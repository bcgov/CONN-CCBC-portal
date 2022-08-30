-- Verify mocks:set_mocked_time on pg

begin;

select pg_get_functiondef('mocks.set_mocked_time(timestamptz)'::regprocedure);

rollback;
