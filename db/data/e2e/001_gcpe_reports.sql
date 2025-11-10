begin;

select mocks.set_mocked_time_in_transaction('2024-08-20 13:00:00-07'::timestamptz);

insert into ccbc_public.reporting_gcpe (id, report_data, created_by, created_at, updated_by, updated_at, archived_by, archived_at)
overriding system value values
  (
    1, $$[
  [
    {
      "span": 12,
      "wrap": true,
      "value": "INTERNAL USE ONLY: Sample GCPE data\\nGENERATED: August 20, 2024 at 2:08 PM PDT",
      "height": 50,
      "fontSize": 16,
      "fontWeight": "bold",
      "backgroundColor": "#f2f2f2"
    },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  [
    {
      "wrap": true,
      "value": "Program",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Announced by Province",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Change Request Pending",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Complete",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Phase",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project #",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Federal Project #",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Applicant",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Title",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Economic Region",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Federal Funding Source",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Status",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "% Project Milestone Complete",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Milestone Completion Date",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Description",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Conditional Approval Letter Sent to Applicant",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Binding Agreement Signed",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Type",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "BC Funding Requested",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Federal Funding Requested",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "FHNA Funding",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Applicant Amount",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Other Funding Requested",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Total Project Budget",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Communities and Locales Total Count ",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Indigenous Communities",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Locations",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Household Count",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Transport km",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Highway km",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Rest Areas",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Connected Coast Network Dependent",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Proposed Start Date",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Date Conditionally Approved",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Proposed Project Milestone Completion Date",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Date Announced",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Primary News Release",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Secondary News Release",
      "height": 95,
      "fontWeight": "bold"
    }
  ],
  [
    {
      "value": "CBC"
    },
    {
      "value": "YES"
    },
    {
      "value": "NO"
    },
    {
      "value": "YES"
    },
    {
      "value": 1
    },
    {
      "value": 7001
    },
    {
      "value": "CBC-7001-FED"
    },
    {
      "value": "Example Telecom Co."
    },
    {
      "value": "Sample Lakes District Build"
    },
    {
      "value": "North Coast"
    },
    {
      "value": "Sample Fund"
    },
    {
      "value": "Reporting Complete"
    },
    {
      "format": "0%",
      "value": 0.8
    },
    {
      "value": "2023-10-15"
    },
    {
      "value": "Demo fibre project connecting remote communities."
    },
    {
      "value": "YES"
    },
    {
      "value": "YES"
    },
    {
      "value": "Last-Mile"
    },
    {
      "format": "$#,##0.00",
      "value": 250000
    },
    {
      "format": "$#,##0.00"
    },
    {},
    {
      "format": "$#,##0.00",
      "value": 125000
    },
    {
      "format": "$#,##0.00",
      "value": 0
    },
    {
      "format": "$#,##0.00",
      "value": 375000
    },
    {
      "value": 3
    },
    {
      "value": 1
    },
    {
      "value": "Sample Creek; Demo Valley"
    },
    {
      "value": 180
    },
    {
      "value": 45.2
    },
    {
      "value": 0
    },
    {},
    {
      "value": "NO"
    },
    {
      "value": "2023-01-01"
    },
    {
      "value": "2023-02-15"
    },
    {
      "value": "2024-03-31"
    },
    {
      "value": "2023-03-01"
    },
    {
      "value": "https://example.com/news/sample-project-a"
    },
    {
      "value": "https://example.com/news/sample-project-overview"
    }
  ]
]$$::jsonb,
    323, '2024-08-20 21:08:38.644337+00'::timestamptz,
    323, '2024-08-20 21:08:38.644337+00'::timestamptz,
    null,
    null
  ),
  (
    2, $$[
  [
    {
      "span": 12,
      "wrap": true,
      "value": "INTERNAL USE ONLY: Sample GCPE data\\nGENERATED: August 20, 2024 at 2:14 PM PDT",
      "height": 50,
      "fontSize": 16,
      "fontWeight": "bold",
      "backgroundColor": "#f2f2f2"
    },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  [
    {
      "wrap": true,
      "value": "Program",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Announced by Province",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Change Request Pending",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Complete",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Phase",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project #",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Federal Project #",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Applicant",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Title",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Economic Region",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Federal Funding Source",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Status",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "% Project Milestone Complete",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Milestone Completion Date",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Description",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Conditional Approval Letter Sent to Applicant",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Binding Agreement Signed",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Type",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "BC Funding Requested",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Federal Funding Requested",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "FHNA Funding",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Applicant Amount",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Other Funding Requested",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Total Project Budget",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Communities and Locales Total Count ",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Indigenous Communities",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Project Locations",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Household Count",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Transport km",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Highway km",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Rest Areas",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Connected Coast Network Dependent",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Proposed Start Date",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Date Conditionally Approved",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Proposed Project Milestone Completion Date",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Date Announced",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Primary News Release",
      "height": 95,
      "fontWeight": "bold"
    },
    {
      "wrap": true,
      "value": "Secondary News Release",
      "height": 95,
      "fontWeight": "bold"
    }
  ],
  [
    {
      "value": "CBC"
    },
    {
      "value": "YES"
    },
    {
      "value": "YES"
    },
    {
      "value": "NO"
    },
    {
      "value": 3
    },
    {
      "value": 7201
    },
    {
      "value": "CBC-7201-REV"
    },
    {
      "value": "North Shore Networks"
    },
    {
      "value": "Mountain Pass Resiliency"
    },
    {
      "value": "Cariboo"
    },
    {
      "value": "Sample Fund"
    },
    {
      "value": "On Hold"
    },
    {
      "format": "0%",
      "value": 0.35
    },
    {
      "value": "2024-11-20"
    },
    {
      "value": "Redundant routes to protect backbone connectivity."
    },
    {
      "value": "YES"
    },
    {
      "value": "NO"
    },
    {
      "value": "Backbone"
    },
    {
      "format": "$#,##0.00",
      "value": 520000
    },
    {
      "format": "$#,##0.00",
      "value": 520000
    },
    {},
    {
      "format": "$#,##0.00",
      "value": 260000
    },
    {
      "format": "$#,##0.00",
      "value": 0
    },
    {
      "format": "$#,##0.00",
      "value": 1300000
    },
    {
      "value": 6
    },
    {
      "value": 2
    },
    {
      "value": "Summit Ridge; Glacier Flats"
    },
    {
      "value": 310
    },
    {
      "value": 95
    },
    {
      "value": 15
    },
    {},
    {
      "value": "YES"
    },
    {
      "value": "2023-08-01"
    },
    {
      "value": "2023-09-10"
    },
    {
      "value": "2025-05-30"
    },
    {
      "value": "2023-09-30"
    },
    {
      "value": "https://example.com/news/resiliency"
    },
    {
      "value": "https://example.com/news/resiliency-background"
    }
  ]
]$$::jsonb,
    323, '2024-08-20 21:14:18.637334+00'::timestamptz,
    323, '2024-08-20 21:14:18.637334+00'::timestamptz,
    null,
    null
  );

commit;
