begin;

select plan(2);

select has_function(
  'ccbc_public', 'receive_applications',
  'Function receive_applications should exist'
);

-- Test setup - user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number)
overriding system value
values
  (2, '2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 1),
  (3, '2024-08-19 09:00:00 America/Vancouver','2024-11-06 09:00:00 America/Vancouver', 2);

insert into ccbc_public.application
  (id, ccbc_number, owner, form_data,last_edited_page, intake_id) overriding system value
   values
  (1,'CCBC-010001', '11111111-1111-1111-1111-111111111111','{}','projectInformation', 2),
  (2,'CCBC-010001', '11111111-1111-1111-1111-111111111112','{}','projectInformation', 3),
  (3,'CCBC-010001', '11111111-1111-1111-1111-111111111113','{}','projectInformation', 3),
  (4,'CCBC-010001', '11111111-1111-1111-1111-111111111113','{}','projectInformation', 3);


insert into ccbc_public.application_status (application_id, status) VALUES 
(1, 'submitted'),
(2, 'submitted'),
(3, 'submitted'),
(4, 'submitted');

select results_eq(
  $$
    select count(*) from ccbc_public.application_status where status = 'submitted';
  $$,
  ARRAY['4'::bigint],
    'Count 4 applications with submitted status'
);

select ccbc_public.receive_applications();


select results_eq(
  $$
    select count(*) from ccbc_public.application_status where status = 'received';
  $$,
  ARRAY['3'::bigint],
    'Expect 3 rows where status is received'
);

select finish();

rollback;
