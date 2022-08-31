-- Deploy mocks:set_mocked_time to pg
-- requires: mock_now_method

begin;

  drop function mocks.set_mocked_time; 

commit;
