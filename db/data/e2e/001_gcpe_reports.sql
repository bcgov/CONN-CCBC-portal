begin;

truncate table ccbc_public.reporting_gcpe restart identity cascade;

insert into ccbc_public.ccbc_user (session_sub, given_name, family_name, email_address)
values
  ('mockUser@ccbc_admin', 'CCBC', 'Admin', 'ccbc_admin@gov.bc.ca'),
  ('mockUser@cbc_admin', 'CBC', 'Admin', 'cbc_admin@gov.bc.ca'),
  ('mockUser@ccbc_analyst', 'CCBC', 'Analyst', 'ccbc_analyst@gov.bc.ca'),
  ('mockUser@super_admin', 'Super', 'Admin', 'super_admin@gov.bc.ca')
on conflict (session_sub) do update set
  given_name = excluded.given_name,
  family_name = excluded.family_name,
  email_address = excluded.email_address;

select setval(
  'ccbc_public.ccbc_user_id_seq',
  (select coalesce(max(id), 1) from ccbc_public.ccbc_user),
  true
);

set jwt.claims.sub to 'mockUser@ccbc_admin';
select mocks.set_mocked_time_in_transaction('2024-01-02 10:00:00-08'::timestamptz);
insert into ccbc_public.reporting_gcpe (report_data)
values (
  $$[
    [
      {
        "value": "INTERNAL USE ONLY: Not to be distributed outside Ministry of Citizens' Services\nGENERATED: January 2, 2024 at 10:00 AM PST",
        "span": 12,
        "wrap": true
      }
    ],
    [
      { "value": "Program" },
      { "value": "Announced by Province" },
      { "value": "Project #" },
      { "value": "Applicant" }
    ],
    [
      { "value": "CBC" },
      { "value": "YES" },
      { "value": 5054 },
      { "value": "Internet company 1" }
    ]
  ]$$::jsonb
);

set jwt.claims.sub to 'mockUser@cbc_admin';
select mocks.set_mocked_time_in_transaction('2024-01-08 14:30:00-08'::timestamptz);
insert into ccbc_public.reporting_gcpe (report_data)
values (
  $$[
    [
      {
        "value": "INTERNAL USE ONLY: Not to be distributed outside Ministry of Citizens' Services\nGENERATED: January 8, 2024 at 2:30 PM PST",
        "span": 12,
        "wrap": true
      }
    ],
    [
      { "value": "Program" },
      { "value": "Announced by Province" },
      { "value": "Project #" },
      { "value": "Applicant" }
    ],
    [
      { "value": "CCBC" },
      { "value": "NO" },
      { "value": "CCBC-010001" },
      { "value": "Test org name" }
    ]
  ]$$::jsonb
);

reset jwt.claims.sub;

select setval(
  'ccbc_public.reporting_gcpe_id_seq',
  (select coalesce(max(id), 1) from ccbc_public.reporting_gcpe),
  true
);

commit;
