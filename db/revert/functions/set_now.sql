-- Revert mocks:mock_now_method  

begin;


  drop function mocks.now();

commit;
