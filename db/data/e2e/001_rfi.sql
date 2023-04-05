begin;

do
$$
declare _application_id int;
begin

perform mocks.set_mocked_time_in_transaction('2022-10-09 09:00:00-07'::timestamptz);

select id into _application_id from ccbc_public.application limit 1;

perform ccbc_public.create_rfi(_application_id, '{
  "rfiType": [
    "Missing files or information"
  ],
  "rfiDueBy": "2023-03-23",
  "rfiAdditionalFiles": {
    "detailedBudgetRfi": true,
    "eligibilityAndImpactsCalculatorRfi": true
  }
}'::jsonb);

end
$$ language plpgsql;

commit;
