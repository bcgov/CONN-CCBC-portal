import { act, fireEvent, screen } from '@testing-library/react';
import * as moduleApi from '@growthbook/growthbook-react';
import { FeatureResult, JSONValue } from '@growthbook/growthbook-react';
import History from 'pages/analyst/application/[applicationId]/history';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledhistoryQuery, {
  historyQuery,
} from '__generated__/historyQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      applicationByRowId: {
        history: {
          nodes: [
            {
              applicationId: 6,
              createdAt: '2023-03-03T07:57:08.820373-08:00',
              familyName: '',
              item: 'application',
              givenName: '',
              op: 'INSERT',
              record: {
                id: 6,
                owner: '8aeecc40e7e74568bd8fa94e440f7e0b@bceidbasic',
                intake_id: null,
                created_at: '2023-03-03T07:57:08.820373-08:00',
                created_by: 3,
                updated_at: '2023-03-03T07:57:08.820373-08:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                ccbc_number: null,
              },
              recordId: '5074afcc-87be-5d86-b3da-f0df836635b2',
              sessionSub: '8aeecc40e7e74568bd8fa94e440f7e0b@bceidbasic',
              tableName: 'application',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T07:57:08.820373-08:00',
              familyName: '',
              item: 'draft',
              givenName: '',
              op: 'INSERT',
              record: {
                id: 16,
                status: 'draft',
                created_at: '2023-03-03T07:57:08.820373-08:00',
                created_by: 3,
                change_reason: null,
                application_id: 6,
              },
              recordId: '14777180-f013-5613-b413-a11c4fa67cad',
              sessionSub: '8aeecc40e7e74568bd8fa94e440f7e0b@bceidbasic',
              tableName: 'application_status',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T07:58:06.466171-08:00',
              familyName: '',
              item: 'submitted',
              givenName: '',
              op: 'INSERT',
              record: {
                id: 17,
                status: 'submitted',
                created_at: '2023-03-03T07:58:06.466171-08:00',
                created_by: 3,
                change_reason: null,
                application_id: 6,
              },
              recordId: '174e38d8-646d-5fef-acad-8d08f8cad09c',
              sessionSub: '8aeecc40e7e74568bd8fa94e440f7e0b@bceidbasic',
              tableName: 'application_status',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:02:19.762303-08:00',
              familyName: 'bar',
              item: 'received',
              givenName: 'foo1',
              op: 'INSERT',
              record: {
                id: 19,
                status: 'received',
                created_at: '2023-03-03T08:02:19.762303-08:00',
                created_by: null,
                change_reason: null,
                application_id: 6,
              },
              recordId: 'd96f936e-a01a-5a9a-b3bf-77f902847857',
              sessionSub: 'mockUser@ccbc_auth_user',
              tableName: 'application_status',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:02:55.547968-08:00',
              familyName: 'Bar',
              item: 'screening',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 20,
                status: 'screening',
                created_at: '2023-03-03T08:02:55.547968-08:00',
                created_by: 2,
                change_reason: 'change reason screening',
                application_id: 6,
              },
              recordId: '7162d64b-6b89-505a-b9bc-29a047dcb26a',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_status',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:22:39.146395-08:00',
              familyName: 'Bar',
              item: 'complete',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 21,
                status: 'complete',
                created_at: '2023-03-03T08:22:39.146395-08:00',
                created_by: 2,
                change_reason: 'change reason complete',
                application_id: 6,
              },
              recordId: '667cf30e-51a5-5348-97ce-a78e8786edf0',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_status',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:22:46.400664-08:00',
              familyName: 'Bar',
              item: 'assessment',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 22,
                status: 'assessment',
                created_at: '2023-03-03T08:22:46.400664-08:00',
                created_by: 2,
                change_reason: 'change reason assessment',
                application_id: 6,
              },
              recordId: '00b9677c-0d5f-5fc1-8481-1b2203b6e6d3',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_status',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:22:51.651375-08:00',
              familyName: 'Bar',
              item: 'on_hold',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 23,
                status: 'on_hold',
                created_at: '2023-03-03T08:22:51.651375-08:00',
                created_by: 2,
                change_reason: 'change reason on hold',
                application_id: 6,
              },
              recordId: '3aed5763-8464-51ab-b686-28e0f32097f1',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_status',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:51:23.818805-08:00',
              familyName: 'Bar',
              item: 'recommendation',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 25,
                status: 'recommendation',
                created_at: '2023-03-03T08:51:23.818805-08:00',
                created_by: 2,
                change_reason: '',
                application_id: 6,
              },
              recordId: 'a3586616-c84c-5e36-b085-373d77817070',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_status',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:51:41.058338-08:00',
              familyName: 'Bar',
              item: 'approved',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 26,
                status: 'approved',
                created_at: '2023-03-03T08:51:41.058338-08:00',
                created_by: 2,
                change_reason: 'change reason approved',
                application_id: 6,
              },
              recordId: '38dbd2b8-7265-5a95-9d0a-ab654eac4492',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_status',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:05:02.337632-08:00',
              familyName: '',
              item: 'file_10M.bin',
              givenName: '',
              op: 'INSERT',
              record: {
                id: 1,
                file: 'a7e1da27-ab21-4acc-9fe4-08a7c2de3839',
                file_name: 'file_10M.bin',
                file_size: '9.54 MB',
                file_type: 'application/macbinary',
                created_at: '2023-03-03T08:05:02.337632-08:00',
                created_by: 3,
                updated_at: '2023-03-03T08:05:02.337632-08:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                description: null,
                application_id: 6,
                application_status_id: null,
              },
              recordId: 'cfe82d9a-fdfc-5ac6-9433-36d0c912c35c',
              sessionSub: '8aeecc40e7e74568bd8fa94e440f7e0b@bceidbasic',
              tableName: 'attachment',
              externalAnalyst: null,
            },

            {
              applicationId: 6,
              createdAt: '2023-03-03T08:03:09.197851-08:00',
              familyName: 'Bar',
              item: 'screening',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 7,
                json_data: {},
                created_at: '2023-03-03T08:03:09.197851-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:03:09.197851-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
                assessment_data_type: 'screening',
              },
              recordId: '5f47db93-e373-578e-97c7-e29b7c564c38',
              sessionSub: 'test-session-sub@idir',
              tableName: 'assessment_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:03:14.904313-08:00',
              familyName: 'Bar',
              item: 'technical',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 8,
                json_data: {},
                created_at: '2023-03-03T08:03:14.904313-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:03:14.904313-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
                assessment_data_type: 'technical',
              },
              recordId: 'ee151855-7281-53a5-a030-cd9a9e8c22b5',
              sessionSub: 'test-session-sub@idir',
              tableName: 'assessment_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:03:21.365441-08:00',
              familyName: 'Bar',
              item: 'projectManagement',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 9,
                json_data: {},
                created_at: '2023-03-03T08:03:21.365441-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:03:21.365441-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
                assessment_data_type: 'projectManagement',
              },
              recordId: 'b700cdce-1b3e-5a1b-a8f8-b2596395c84c',
              sessionSub: 'test-session-sub@idir',
              tableName: 'assessment_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:12:35.285551-08:00',
              familyName: 'Bar',
              item: 'screening',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 12,
                json_data: {},
                created_at: '2023-03-03T08:12:35.285551-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:12:35.285551-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
                assessment_data_type: 'screening',
              },
              recordId: 'f5926fb2-25e7-5c1c-b200-350af964cbbf',
              sessionSub: 'test-session-sub@idir',
              tableName: 'assessment_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:06:24.621672-08:00',
              familyName: 'Bar',
              item: 'financialRisk',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 10,
                json_data: {},
                created_at: '2023-03-03T08:06:24.621672-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:06:24.621672-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
                assessment_data_type: 'financialRisk',
              },
              recordId: '2d439cdb-ee31-5b91-b6db-cc8bc3fb0f63',
              sessionSub: 'test-session-sub@idir',
              tableName: 'assessment_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:06:31.298479-08:00',
              familyName: 'Bar',
              item: 'permitting',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 11,
                json_data: {},
                created_at: '2023-03-03T08:06:31.298479-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:06:31.298479-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
                assessment_data_type: 'permitting',
              },
              recordId: 'be57537b-1bcd-5620-b2ea-21f910cbb27e',
              sessionSub: 'test-session-sub@idir',
              tableName: 'assessment_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T09:50:51.15027-08:00',
              familyName: 'Bar',
              item: 'screening',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 13,
                json_data: {
                  assignedTo: 'TestNameHopefullyUnique',
                  otherFiles: [
                    { name: 'FileNameThatIsAlsoUniqueToScreening.xlsx' },
                  ],
                },
                created_at: '2023-03-03T09:50:51.15027-08:00',
                created_by: 2,
                updated_at: '2023-03-03T09:50:51.15027-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
                assessment_data_type: 'screening',
              },
              recordId: '25efae40-f000-591c-a43d-7ba95b807c06',
              sessionSub: 'test-session-sub@idir',
              tableName: 'assessment_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:03:36.184206-08:00',
              familyName: 'Bar',
              item: '["Missing files or information"]',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 2,
                json_data: {
                  rfiType: ['Missing files or information'],
                  rfiDueBy: '2023-06-30',
                  rfiAdditionalFiles: {
                    lastMileIspOfferingRfi: true,
                  },
                  rfiEmailCorrespondance: [
                    {
                      id: 9,
                      name: 'fake.txt',
                      size: 0,
                      type: 'text/plain',
                      uuid: 'e33df8e1-fdf0-4a15-83e7-cad163549ce1',
                    },
                  ],
                },
                created_at: '2023-03-03T08:03:36.184206-08:00',
                created_by: 2,
                rfi_number: 'CCBC-020001-1',
                updated_at: '2023-03-03T08:03:36.184206-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                rfi_data_status_type_id: 'draft',
              },
              recordId: '7fac1fe1-27e6-5e03-a79a-f48208afd8f4',
              sessionSub: 'test-session-sub@idir',
              tableName: 'rfi_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:05:20.645457-08:00',
              familyName: '',
              item: '["Missing files or information"]',
              givenName: '',
              op: 'INSERT',
              record: {
                id: 3,
                json_data: {
                  rfiType: ['Missing files or information'],
                  rfiDueBy: '2023-06-30',
                  rfiAdditionalFiles: {
                    lastMileIspOffering: [
                      {
                        id: 10,
                        name: 'hotfix-55d8c6678b-zgdh4-hotfix.log',
                        size: 2957,
                        type: '',
                        uuid: '2304da5c-f855-438d-b1d5-6a44b2afbf09',
                      },
                    ],
                    lastMileIspOfferingRfi: true,
                  },
                  rfiEmailCorrespondance: [
                    {
                      id: 9,
                      name: 'fake.txt',
                      size: 0,
                      type: 'text/plain',
                      uuid: 'e33df8e1-fdf0-4a15-83e7-cad163549ce1',
                    },
                  ],
                },
                created_at: '2023-03-03T08:05:20.645457-08:00',
                created_by: 3,
                rfi_number: 'CCBC-020001-1',
                updated_at: '2023-03-03T08:05:20.645457-08:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                rfi_data_status_type_id: 'draft',
              },
              recordId: '9a5795e4-ee20-591c-90b4-b795bb2b9cff',
              sessionSub: '8aeecc40e7e74568bd8fa94e440f7e0b@bceidbasic',
              tableName: 'rfi_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:05:20.645457-08:00',
              familyName: 'Bar',
              item: '["Missing files or information"]',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 3,
                json_data: {
                  rfiType: ['Missing files or information'],
                  rfiDueBy: '2023-06-30',
                  rfiAdditionalFiles: {
                    lastMileIspOffering: [
                      {
                        id: 10,
                        name: 'hotfix-55d8c6678b-zgdh4-hotfix.log',
                        size: 2919,
                        type: '',
                        uuid: '2704da5c-f855-438d-b1d5-6a44b2afbf09',
                      },
                    ],
                    lastMileIspOfferingRfi: true,
                  },
                  rfiEmailCorrespondance: [
                    {
                      id: 9,
                      name: 'fake.txt',
                      size: 0,
                      type: 'text/plain',
                      uuid: 'e33df8e1-fdf0-4a15-83e7-cad163549ce1',
                    },
                  ],
                },
              },
              oldRecord: {
                id: 3,
                json_data: {
                  rfiType: ['Missing files or information'],
                  rfiDueBy: '2023-06-30',
                  rfiAdditionalFiles: {
                    lastMileIspOffering: [
                      {
                        id: 10,
                        name: 'hotfix-55d8c6678b-zgdh4-hotfix.log',
                        size: 2955,
                        type: '',
                        uuid: '2504da5c-f855-438d-b1d5-6a44b2afbf09',
                      },
                    ],
                    lastMileIspOfferingRfi: true,
                  },
                  rfiEmailCorrespondance: [
                    {
                      id: 9,
                      name: 'fake.txt',
                      size: 0,
                      type: 'text/plain',
                      uuid: 'e33df8e1-fdf0-4a15-83e7-cad163549ce1',
                    },
                  ],
                },
                created_at: '2023-03-03T08:05:20.645457-08:00',
                created_by: 3,
                rfi_number: 'CCBC-020001-1',
                updated_at: '2023-03-03T08:05:20.645457-08:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                rfi_data_status_type_id: 'draft',
              },
              recordId: '9a5795e4-ee20-591c-90b4-b795bb2b9cff',
              sessionSub: '8aeecc40e7e74568bd8fa94e440f7e0b@bceidbasic',
              tableName: 'rfi_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:07:21.645457-08:00',
              familyName: '',
              item: '["Missing files or information"]',
              givenName: '',
              op: 'INSERT',
              record: {
                id: 5,
                json_data: {
                  rfiType: ['Missing files or information'],
                  rfiDueBy: '2023-06-30',
                  rfiAdditionalFiles: {
                    lastMileIspOffering: [
                      {
                        id: 10,
                        name: 'first_file.txt',
                        size: 2959,
                        type: '',
                        uuid: '2204da5c-f855-438d-b1d5-6a44b2afbf09',
                      },
                    ],
                    lastMileIspOfferingRfi: true,
                  },
                },
              },
              oldRecord: {
                id: 4,
                json_data: {
                  rfiType: ['Missing files or information'],
                  rfiDueBy: '2023-06-30',
                  rfiAdditionalFiles: {
                    lastMileIspOffering: [
                      {
                        id: 10,
                        name: 'second_file.txt',
                        size: 2959,
                        type: '',
                        uuid: '2204da5c-f855-438d-b1d5-6a44b2afbf09',
                      },
                    ],
                    lastMileIspOfferingRfi: true,
                  },
                },
                created_at: '2023-03-03T08:06:20.645457-08:00',
                created_by: 3,
                rfi_number: 'CCBC-020001-1',
                updated_at: '2023-03-03T08:06:20.645457-08:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                rfi_data_status_type_id: 'draft',
              },
              recordId: '9a5795e4-ee20-591c-90b4-b795bb2b9cff',
              sessionSub: '8aeecc40e7e74568bd8fa94e440f7e0b@bceidbasic',
              tableName: 'rfi_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:08:20.645457-08:00',
              familyName: 'Bar',
              item: '["Missing files or information"]',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 3,
                json_data: {
                  rfiType: ['Missing files or information'],
                  rfiDueBy: '2023-06-30',
                  rfiAdditionalFiles: {
                    lastMileIspOffering: [
                      {
                        id: 10,
                        name: 'hotfix-55d8c6678b-zgdh4-hotfix.log',
                        size: 2950,
                        type: '',
                        uuid: '2004da5c-f855-438d-b1d5-6a44b2afbf09',
                      },
                    ],
                    lastMileIspOfferingRfi: true,
                  },
                  rfiEmailCorrespondance: [
                    {
                      id: 9,
                      name: 'fake.txt',
                      size: 0,
                      type: 'text/plain',
                      uuid: 'e33df8e1-fdf0-4a15-83e7-cad163549ce1',
                    },
                  ],
                },
              },
              oldRecord: {
                id: 3,
                json_data: {
                  rfiType: ['Missing files or information'],
                  rfiDueBy: '2023-06-30',
                  rfiAdditionalFiles: {
                    lastMileIspOffering: [
                      {
                        id: 100,
                        name: 'test.log',
                        size: 3120,
                        type: '',
                        uuid: '2304da5c-f855-438d-b1d5-6a44b2afbf09',
                      },
                    ],
                    lastMileIspOfferingRfi: true,
                  },
                  rfiEmailCorrespondance: [
                    {
                      id: 9,
                      name: 'fake.txt',
                      size: 0,
                      type: 'text/plain',
                      uuid: 'e33df8e1-fdf0-4a15-83e7-cad163549ce1',
                    },
                  ],
                },
                created_at: '2023-03-03T08:08:20.645457-08:00',
                created_by: 3,
                rfi_number: 'CCBC-020001-1',
                updated_at: '2023-03-03T08:08:20.645457-08:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                rfi_data_status_type_id: 'draft',
              },
              recordId: '9a5795e4-ee20-591c-90b4-b795bb2b9cff',
              sessionSub: 'fakeSub@idir',
              tableName: 'rfi_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:22:59.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 9,
                json_data: {
                  submission: {
                    submissionDate: '2023-03-03',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    organizationName: 'org name received',
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: 'a9702e4f-37b7-5915-998f-63449d26c500',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-06T09:24:53.482996-08:00',
              familyName: 'Bar',
              item: '6',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 6,
                package: 6,
                created_at: '2023-03-06T09:24:53.482996-08:00',
                created_by: 2,
                updated_at: '2023-03-06T09:24:53.482996-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
              },
              recordId: '47fa0d90-8d4e-554e-858d-5133495e2508',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_package',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-06T09:24:44.034951-08:00',
              familyName: 'Bar',
              item: 'Foo Bar',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 10,
                analyst_id: 1,
                created_at: '2023-03-06T09:24:44.034951-08:00',
                created_by: 2,
                updated_at: '2023-03-06T09:24:44.034951-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
              },
              recordId: 'a0075805-9cf3-5ae0-b047-8ba47ffbf40f',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_analyst_lead',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-06T09:24:44.034951-08:00',
              familyName: 'Analyst',
              item: 'External Analyst',
              givenName: 'External',
              op: 'INSERT',
              record: {
                id: 10,
                analyst_id: 1,
                created_at: '2023-03-06T09:24:44.034951-08:00',
                created_by: 2,
                updated_at: '2023-03-06T09:24:44.034951-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
              },
              recordId: 'a0075805-9cf3-5ae0-b047-8ba47ffbf40f',
              sessionSub: 'test-session-sub@bceidbusiness',
              tableName: 'application_analyst_lead',
              externalAnalyst: true,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:23:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 11,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: ['Alberta'],
                    projectSpanMultipleLocations: true,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    organizationName: 'org name received',
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '7d39cc52-6c9c-58ac-82d4-6c9f1f7eeed8',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:24:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 12,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: ['Alberta'],
                    projectSpanMultipleLocations: true,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    organizationName: 'org name received',
                  },
                  organizationLocation: {
                    city: 'victoria',
                    province: 'British Columbia',
                    postalCode: 'v0v0v0',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      provinceMailing: 'British Columbia',
                      postalCodeMailing: 'v9c0v1',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    isMailingAddress: false,
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '4b9a683d-4e8b-59d1-b435-13a43247b3b1',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:25:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 13,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: ['Alberta'],
                    projectSpanMultipleLocations: true,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    other: 'other type',
                    isSubsidiary: true,
                    operatingName: 'operating',
                    parentOrgName: 'parent org',
                    businessNumber: '123456789',
                    isNameLegalName: false,
                    organizationName: 'org name received',
                    isIndigenousEntity: true,
                    typeOfOrganization: 'Other',
                    orgRegistrationDate: '2023-04-24',
                    indigenousEntityDesc: 'some description',
                    organizationOverview: 'some overview',
                  },
                  organizationLocation: {
                    city: 'victoria',
                    province: 'British Columbia',
                    postalCode: 'v0v0v0',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      provinceMailing: 'British Columbia',
                      postalCodeMailing: 'v9c0v1',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    isMailingAddress: false,
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '6106a30c-3a42-53eb-9a82-72c81a6785af',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:26:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 14,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: ['Alberta'],
                    projectSpanMultipleLocations: true,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    other: 'other type',
                    isSubsidiary: true,
                    operatingName: 'operating',
                    parentOrgName: 'parent org',
                    businessNumber: '123456789',
                    isNameLegalName: false,
                    organizationName: 'org name received',
                    isIndigenousEntity: true,
                    typeOfOrganization: 'Other',
                    orgRegistrationDate: '2023-04-24',
                    indigenousEntityDesc: 'some description',
                    organizationOverview: 'some overview',
                  },
                  organizationLocation: {
                    city: 'victoria',
                    province: 'British Columbia',
                    postalCode: 'v0v0v0',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      provinceMailing: 'British Columbia',
                      postalCodeMailing: 'v9c0v1',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    isMailingAddress: false,
                  },
                  existingNetworkCoverage: {
                    hasPassiveInfrastructure: true,
                    isInfrastructureAvailable: true,
                    hasProvidedExitingNetworkCoverage:
                      'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
                    requiresThirdPartyInfrastructureAccess: false,
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '408ea940-7c06-5f8f-9738-ced7315a9fe6',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:27:59.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 15,
                json_data: {
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  existingNetworkCoverage: {
                    hasPassiveInfrastructure: true,
                    hasProvidedExitingNetworkCoverage:
                      'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
                    isInfrastructureAvailable: true,
                    requiresThirdPartyInfrastructureAccess: false,
                  },
                  organizationLocation: {
                    city: 'victoria',
                    isMailingAddress: false,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      postalCodeMailing: 'v9c0v1',
                      provinceMailing: 'British Columbia',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    postalCode: 'v0v0v0',
                    province: 'British Columbia',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                  },
                  organizationProfile: {
                    businessNumber: '123456789',
                    indigenousEntityDesc: 'some description',
                    isIndigenousEntity: true,
                    isNameLegalName: false,
                    isSubsidiary: true,
                    operatingName: 'operating',
                    organizationName: 'org name received',
                    organizationOverview: 'some overview',
                    orgRegistrationDate: '2023-04-24',
                    other: 'other type',
                    parentOrgName: 'parent org',
                    typeOfOrganization: 'Other',
                  },
                  otherFundingSources: {
                    otherFundingSources: true,
                    otherFundingSourcesArray: [
                      {
                        funderType: 'Federal',
                        statusOfFunding: 'Submitted',
                        fundingPartnersName: 'partner 1',
                        nameOfFundingProgram: 'program',
                        fundingSourceContactInfo:
                          'test,123 main st, 250-555-5555,test@test.com',
                        requestedFundingPartner2223: 11,
                        requestedFundingPartner2324: 11,
                        requestedFundingPartner2425: 11,
                        requestedFundingPartner2526: 11,
                        requestedFundingPartner2627: 11,
                        totalRequestedFundingPartner: 55,
                      },
                    ],
                    infrastructureBankFunding2223: 1,
                    infrastructureBankFunding2324: 2,
                    infrastructureBankFunding2425: 3,
                    infrastructureBankFunding2526: 4,
                    totalInfrastructureBankFunding: 10,
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    projectSpanMultipleLocations: true,
                    provincesTerritories: ['Alberta'],
                  },
                  projectInformation: {
                    geographicAreaDescription: 'some test location',
                    projectDescription: 'who, what where, when, and why',
                    projectTitle: 'Received Application Title',
                  },
                  submission: {
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '7dac9403-e08f-551e-b092-9343005bb856',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:28:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 16,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: ['Alberta'],
                    projectSpanMultipleLocations: true,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    other: 'other type',
                    isSubsidiary: true,
                    operatingName: 'operating',
                    parentOrgName: 'parent org',
                    businessNumber: '123456789',
                    isNameLegalName: false,
                    organizationName: 'org name received',
                    isIndigenousEntity: true,
                    typeOfOrganization: 'Other',
                    orgRegistrationDate: '2023-04-24',
                    indigenousEntityDesc: 'some description',
                    organizationOverview: 'some overview',
                  },
                  otherFundingSources: {
                    otherFundingSources: true,
                    otherFundingSourcesArray: [
                      {
                        funderType: 'Federal',
                        statusOfFunding: 'Submitted',
                        fundingPartnersName: 'partner 1',
                        nameOfFundingProgram: 'program',
                        fundingSourceContactInfo:
                          'test,123 main st, 250-555-5555,test@test.com',
                        requestedFundingPartner2223: 11,
                        requestedFundingPartner2324: 11,
                        requestedFundingPartner2425: 11,
                        requestedFundingPartner2526: 11,
                        requestedFundingPartner2627: 11,
                        totalRequestedFundingPartner: 55,
                      },
                    ],
                    infrastructureBankFunding2223: 1,
                    infrastructureBankFunding2324: 2,
                    infrastructureBankFunding2425: 3,
                    infrastructureBankFunding2526: 4,
                    totalInfrastructureBankFunding: 10,
                  },
                  organizationLocation: {
                    city: 'victoria',
                    province: 'British Columbia',
                    postalCode: 'v0v0v0',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      provinceMailing: 'British Columbia',
                      postalCodeMailing: 'v9c0v1',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    isMailingAddress: false,
                  },
                  existingNetworkCoverage: {
                    hasPassiveInfrastructure: true,
                    isInfrastructureAvailable: true,
                    hasProvidedExitingNetworkCoverage:
                      'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
                    requiresThirdPartyInfrastructureAccess: false,
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: 'fd38647a-823d-57d9-a637-22071974710f',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:29:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 17,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: ['Alberta'],
                    projectSpanMultipleLocations: true,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    other: 'other type',
                    isSubsidiary: true,
                    operatingName: 'operating',
                    parentOrgName: 'parent org',
                    businessNumber: '123456789',
                    isNameLegalName: false,
                    organizationName: 'org name received',
                    isIndigenousEntity: true,
                    typeOfOrganization: 'Other',
                    orgRegistrationDate: '2023-04-24',
                    indigenousEntityDesc: 'some description',
                    organizationOverview: 'some overview',
                  },
                  otherFundingSources: {
                    otherFundingSources: true,
                    otherFundingSourcesArray: [
                      {
                        funderType: 'Federal',
                        statusOfFunding: 'Submitted',
                        fundingPartnersName: 'partner 1',
                        nameOfFundingProgram: 'program',
                        fundingSourceContactInfo:
                          'test,123 main st, 250-555-5555,test@test.com',
                        requestedFundingPartner2223: 1,
                        requestedFundingPartner2324: 11,
                        requestedFundingPartner2425: 11,
                        requestedFundingPartner2526: 11,
                        requestedFundingPartner2627: 11,
                        totalRequestedFundingPartner: 45,
                      },
                    ],
                    infrastructureBankFunding2223: 1,
                    infrastructureBankFunding2324: 2,
                    infrastructureBankFunding2425: 3,
                    infrastructureBankFunding2526: 4,
                    totalInfrastructureBankFunding: 10,
                  },
                  organizationLocation: {
                    city: 'victoria',
                    province: 'British Columbia',
                    postalCode: 'v0v0v0',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      provinceMailing: 'British Columbia',
                      postalCodeMailing: 'v9c0v1',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    isMailingAddress: false,
                  },
                  existingNetworkCoverage: {
                    hasPassiveInfrastructure: true,
                    isInfrastructureAvailable: true,
                    hasProvidedExitingNetworkCoverage:
                      'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
                    requiresThirdPartyInfrastructureAccess: false,
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: 'e9f5bd85-110f-5fce-af94-3b8ae90a2018',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:30:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 18,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: ['Alberta'],
                    projectSpanMultipleLocations: false,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    other: 'other type',
                    isSubsidiary: true,
                    operatingName: 'operating',
                    parentOrgName: 'parent org',
                    businessNumber: '123456789',
                    isNameLegalName: false,
                    organizationName: 'org name received',
                    isIndigenousEntity: true,
                    typeOfOrganization: 'Other',
                    orgRegistrationDate: '2023-04-24',
                    indigenousEntityDesc: 'some description',
                    organizationOverview: 'some overview',
                  },
                  otherFundingSources: {
                    otherFundingSources: true,
                    otherFundingSourcesArray: [
                      {
                        funderType: 'Federal',
                        statusOfFunding: 'Submitted',
                        fundingPartnersName: 'partner 1',
                        nameOfFundingProgram: 'program',
                        fundingSourceContactInfo:
                          'test,123 main st, 250-555-5555,test@test.com',
                        requestedFundingPartner2223: 1,
                        requestedFundingPartner2324: 11,
                        requestedFundingPartner2425: 11,
                        requestedFundingPartner2526: 11,
                        requestedFundingPartner2627: 11,
                        totalRequestedFundingPartner: 45,
                      },
                    ],
                    infrastructureBankFunding2223: 1,
                    infrastructureBankFunding2324: 2,
                    infrastructureBankFunding2425: 3,
                    infrastructureBankFunding2526: 4,
                    totalInfrastructureBankFunding: 10,
                  },
                  organizationLocation: {
                    city: 'victoria',
                    province: 'British Columbia',
                    postalCode: 'v0v0v0',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      provinceMailing: 'British Columbia',
                      postalCodeMailing: 'v9c0v1',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    isMailingAddress: false,
                  },
                  existingNetworkCoverage: {
                    hasPassiveInfrastructure: true,
                    isInfrastructureAvailable: true,
                    hasProvidedExitingNetworkCoverage:
                      'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
                    requiresThirdPartyInfrastructureAccess: false,
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: 'a4536561-3410-59a1-8943-d20f16b1d89d',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:31:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 19,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: [],
                    projectSpanMultipleLocations: true,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    other: 'other type',
                    isSubsidiary: true,
                    operatingName: 'operating',
                    parentOrgName: 'parent org',
                    businessNumber: '123456789',
                    isNameLegalName: false,
                    organizationName: 'org name received',
                    isIndigenousEntity: true,
                    typeOfOrganization: 'Other',
                    orgRegistrationDate: '2023-04-24',
                    indigenousEntityDesc: 'some description',
                    organizationOverview: 'some overview',
                  },
                  otherFundingSources: {
                    otherFundingSources: true,
                    otherFundingSourcesArray: [
                      {
                        funderType: 'Federal',
                        statusOfFunding: 'Submitted',
                        fundingPartnersName: 'partner 1',
                        nameOfFundingProgram: 'program',
                        fundingSourceContactInfo:
                          'test,123 main st, 250-555-5555,test@test.com',
                        requestedFundingPartner2223: 1,
                        requestedFundingPartner2324: 11,
                        requestedFundingPartner2425: 11,
                        requestedFundingPartner2526: 11,
                        requestedFundingPartner2627: 11,
                        totalRequestedFundingPartner: 45,
                      },
                    ],
                    infrastructureBankFunding2223: 1,
                    infrastructureBankFunding2324: 2,
                    infrastructureBankFunding2425: 3,
                    infrastructureBankFunding2526: 4,
                    totalInfrastructureBankFunding: 10,
                  },
                  organizationLocation: {
                    city: 'victoria',
                    province: 'British Columbia',
                    postalCode: 'v0v0v0',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      provinceMailing: 'British Columbia',
                      postalCodeMailing: 'v9c0v1',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    isMailingAddress: false,
                  },
                  existingNetworkCoverage: {
                    hasPassiveInfrastructure: true,
                    isInfrastructureAvailable: true,
                    hasProvidedExitingNetworkCoverage:
                      'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
                    requiresThirdPartyInfrastructureAccess: false,
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '246425a4-e371-572a-ba34-285dc7077170',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:32:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 20,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: [
                      'Northwest Territories',
                      'Yukon',
                      'Alberta',
                    ],
                    projectSpanMultipleLocations: true,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    other: 'other type',
                    isSubsidiary: true,
                    operatingName: 'operating',
                    parentOrgName: 'parent org',
                    businessNumber: '123456789',
                    isNameLegalName: false,
                    organizationName: 'org name received',
                    isIndigenousEntity: true,
                    typeOfOrganization: 'Other',
                    orgRegistrationDate: '2023-04-24',
                    indigenousEntityDesc: 'some description',
                    organizationOverview: 'some overview',
                  },
                  otherFundingSources: {
                    otherFundingSources: true,
                    otherFundingSourcesArray: [
                      {
                        funderType: 'Federal',
                        statusOfFunding: 'Submitted',
                        fundingPartnersName: 'partner 1',
                        nameOfFundingProgram: 'program',
                        fundingSourceContactInfo:
                          'test,123 main st, 250-555-5555,test@test.com',
                        requestedFundingPartner2223: 1,
                        requestedFundingPartner2324: 11,
                        requestedFundingPartner2425: 11,
                        requestedFundingPartner2526: 11,
                        requestedFundingPartner2627: 11,
                        totalRequestedFundingPartner: 45,
                      },
                    ],
                    infrastructureBankFunding2223: 1,
                    infrastructureBankFunding2324: 2,
                    infrastructureBankFunding2425: 3,
                    infrastructureBankFunding2526: 4,
                    totalInfrastructureBankFunding: 10,
                  },
                  organizationLocation: {
                    city: 'victoria',
                    province: 'British Columbia',
                    postalCode: 'v0v0v0',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      provinceMailing: 'British Columbia',
                      postalCodeMailing: 'v9c0v1',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    isMailingAddress: false,
                  },
                  existingNetworkCoverage: {
                    hasPassiveInfrastructure: true,
                    isInfrastructureAvailable: true,
                    hasProvidedExitingNetworkCoverage:
                      'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
                    requiresThirdPartyInfrastructureAccess: false,
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '96da0b30-0e59-59dc-9ab6-7e67f83447ea',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:33:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 21,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: [
                      'Northwest Territories',
                      'Yukon',
                      'Alberta',
                    ],
                    projectSpanMultipleLocations: true,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    other: 'other type',
                    isSubsidiary: true,
                    parentOrgName: 'parent org',
                    businessNumber: '123456789',
                    isNameLegalName: false,
                    organizationName: 'org name received',
                    isIndigenousEntity: true,
                    typeOfOrganization: 'Other',
                    orgRegistrationDate: '2023-04-24',
                    indigenousEntityDesc: 'some description',
                    organizationOverview: 'some overview',
                  },
                  otherFundingSources: {
                    otherFundingSources: true,
                    otherFundingSourcesArray: [
                      {
                        funderType: 'Federal',
                        statusOfFunding: 'Submitted',
                        fundingPartnersName: 'partner 1',
                        nameOfFundingProgram: 'program',
                        fundingSourceContactInfo:
                          'test,123 main st, 250-555-5555,test@test.com',
                        requestedFundingPartner2223: 1,
                        requestedFundingPartner2324: 11,
                        requestedFundingPartner2425: 11,
                        requestedFundingPartner2526: 11,
                        requestedFundingPartner2627: 11,
                        totalRequestedFundingPartner: 45,
                      },
                    ],
                    infrastructureBankFunding2223: 1,
                    infrastructureBankFunding2324: 2,
                    infrastructureBankFunding2425: 3,
                    infrastructureBankFunding2526: 4,
                    totalInfrastructureBankFunding: 10,
                  },
                  organizationLocation: {
                    city: 'victoria',
                    province: 'British Columbia',
                    postalCode: 'v0v0v0',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      provinceMailing: 'British Columbia',
                      postalCodeMailing: 'v9c0v1',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    isMailingAddress: false,
                  },
                  existingNetworkCoverage: {
                    hasPassiveInfrastructure: true,
                    isInfrastructureAvailable: true,
                    hasProvidedExitingNetworkCoverage:
                      'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
                    requiresThirdPartyInfrastructureAccess: false,
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '1ab4c736-6a56-57a7-a056-a85f73c1186b',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:34:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 22,
                json_data: {
                  submission: {
                    submissionDate: '2022-09-15',
                    submissionTitle: 'Test title',
                    submissionCompletedBy: 'Mr Test',
                    submissionCompletedFor: 'Testing Incorporated',
                  },
                  projectArea: {
                    geographicArea: [2, 1],
                    provincesTerritories: [
                      'Northwest Territories',
                      'Yukon',
                      'Alberta',
                    ],
                    projectSpanMultipleLocations: true,
                  },
                  acknowledgements: {
                    acknowledgementsList: [],
                  },
                  projectInformation: {
                    projectTitle: 'Received Application Title',
                    projectDescription: 'who, what where, when, and why',
                    geographicAreaDescription: 'some test location',
                  },
                  organizationProfile: {
                    other: 'other type',
                    isSubsidiary: true,
                    parentOrgName: 'parent org',
                    businessNumber: '123456789',
                    isNameLegalName: false,
                    organizationName: 'org name received',
                    isIndigenousEntity: true,
                    typeOfOrganization: 'Other',
                    orgRegistrationDate: '2023-04-24',
                    indigenousEntityDesc: 'some description',
                    organizationOverview: 'some overview',
                  },
                  otherFundingSources: {
                    otherFundingSources: true,
                    otherFundingSourcesArray: [
                      {
                        funderType: 'Federal',
                        statusOfFunding: 'Submitted',
                        fundingPartnersName: 'partner 1',
                        nameOfFundingProgram: 'program',
                        fundingSourceContactInfo:
                          'test,123 main st, 250-555-5555,test@test.com',
                        requestedFundingPartner2223: 1,
                        requestedFundingPartner2324: 11,
                        requestedFundingPartner2425: 11,
                        requestedFundingPartner2526: 11,
                        requestedFundingPartner2627: 11,
                        totalRequestedFundingPartner: 45,
                      },
                      {
                        funderType: 'Private',
                        statusOfFunding: 'Approved',
                        fundingPartnersName: 'partner 2',
                        nameOfFundingProgram: 'private inc',
                        fundingSourceContactInfo: 'some information',
                        requestedFundingPartner2223: 2,
                        requestedFundingPartner2324: 2,
                        requestedFundingPartner2425: 2,
                        requestedFundingPartner2526: 2,
                        requestedFundingPartner2627: 2,
                        totalRequestedFundingPartner: 10,
                      },
                      {
                        funderType: 'Municipal',
                        statusOfFunding: 'Pending',
                        fundingPartnersName: 'partner 3',
                        nameOfFundingProgram: 'muni program',
                        fundingSourceContactInfo: 'some info',
                        requestedFundingPartner2223: 3,
                        requestedFundingPartner2324: 3,
                        requestedFundingPartner2425: 3,
                        requestedFundingPartner2526: 3,
                        requestedFundingPartner2627: 3,
                        totalRequestedFundingPartner: 15,
                      },
                    ],
                    infrastructureBankFunding2223: 1,
                    infrastructureBankFunding2324: 2,
                    infrastructureBankFunding2425: 3,
                    infrastructureBankFunding2526: 4,
                    totalInfrastructureBankFunding: 10,
                  },
                  organizationLocation: {
                    city: 'victoria',
                    province: 'British Columbia',
                    postalCode: 'v0v0v0',
                    streetName: 'not mailing st',
                    streetNumber: 123,
                    mailingAddress: {
                      cityMailing: 'victoria',
                      provinceMailing: 'British Columbia',
                      postalCodeMailing: 'v9c0v1',
                      streetNameMailing: 'mailing ave',
                      streetNumberMailing: '456',
                    },
                    isMailingAddress: false,
                  },
                  existingNetworkCoverage: {
                    hasPassiveInfrastructure: true,
                    isInfrastructureAvailable: true,
                    hasProvidedExitingNetworkCoverage:
                      'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
                    requiresThirdPartyInfrastructureAccess: false,
                  },
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: 'f8b75a39-721f-59c6-b407-56240aadcec6',
              sessionSub: 'test-session-sub@idir',
              tableName: 'form_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:35:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 23,
                json_data: {
                  ccbc_number: 'CCBC-010001',
                  GIS_TOTAL_HH: 20,
                  GIS_TOTAL_INDIG_HH: 20,
                  GIS_PERCENT_OVERLAP: 0,
                  number_of_households: 62,
                  GIS_PERCENT_OVERBUILD: 0,
                  GIS_TOTAL_ELIGIBLE_HH: 33,
                  GIS_TOTAL_INELIGIBLE_HH: 0,
                  GIS_TOTAL_ELIGIBLE_INDIG_HH: 20,
                  households_impacted_indigenous: 52,
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '3a96de8d-b588-5c88-9ad0-f61edc116335',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_gis_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:36:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 24,
                json_data: {
                  ccbc_number: 'CCBC-010001',
                  GIS_TOTAL_HH: 22,
                  GIS_TOTAL_INDIG_HH: 22,
                  GIS_PERCENT_OVERLAP: 2,
                  number_of_households: 63,
                  GIS_PERCENT_OVERBUILD: 2,
                  GIS_TOTAL_ELIGIBLE_HH: 22,
                  GIS_TOTAL_INELIGIBLE_HH: 2,
                  GIS_TOTAL_ELIGIBLE_INDIG_HH: 22,
                  households_impacted_indigenous: 53,
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '917748b2-db03-523e-a4d8-9376bf9ca660',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_gis_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:37:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 25,
                json_data: {
                  ccbc_number: 'CCBC-010001',
                  GIS_TOTAL_HH: 22,
                  GIS_TOTAL_INDIG_HH: 22,
                  GIS_PERCENT_OVERLAP: 2,
                  number_of_households: 64,
                  GIS_PERCENT_OVERBUILD: 2,
                  GIS_TOTAL_ELIGIBLE_HH: 22,
                  GIS_TOTAL_INELIGIBLE_HH: 2,
                  GIS_TOTAL_ELIGIBLE_INDIG_HH: 22,
                  households_impacted_indigenous: 53,
                },
                created_at: '2023-03-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-03-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                form_schema_id: 1,
                last_edited_page: null,
                reason_for_change: 'my change reason',
                form_data_status_type_id: 'pending',
              },
              recordId: '6d625077-eafe-52f1-8379-2a23c53775b5',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_gis_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-04-03T08:37:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 1,
                json_data: {
                  dateFundingAgreementSigned: '2023-06-20',
                  hasFundingAgreementBeenSigned: true,
                },
                created_at: '2023-04-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-04-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
              },
              recordId: 'f4569f23-6afa-5492-89cf-cd0fc9c9ccb4',
              sessionSub: 'test-session-sub@idir',
              tableName: 'project_information_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-04-03T08:38:06.589845-08:00',
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 2,
                json_data: {
                  finalizedMapUpload: [
                    {
                      id: 24,
                      name: 'mapTest.kmz',
                      size: 2819,
                      type: '',
                      uuid: '36c5bb0d-0921-4226-9a97-cfde7dd5a514',
                    },
                  ],
                  statementOfWorkUpload: [
                    {
                      id: 7,
                      name: 'sowTest.xlsx',
                      size: 4260251,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: '43d7689d-9e27-45eb-aca2-e35c84b315f7',
                    },
                  ],
                  fundingAgreementUpload: [
                    {
                      id: 14,
                      name: 'fundingTest.txt',
                      size: 0,
                      type: 'text/plain',
                      uuid: '8fb4226e-655e-4321-ba45-fe28aea508f1',
                    },
                  ],
                  sowWirelessUpload: [
                    {
                      id: 25,
                      name: 'sowWireless.xlsx',
                      size: 1475,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: '7fe78587-5509-4821-bd75-b5414f34c448',
                    },
                  ],
                  otherFiles: [
                    {
                      id: 10,
                      name: 'otherImage.png',
                      size: 527870,
                      type: 'image/png',
                      uuid: '192eeda2-e6fa-41e6-9980-25d048eb5717',
                      uploadedAt: '2024-04-08T10:45:03.324-07:00',
                    },
                  ],

                  dateFundingAgreementSigned: '2023-06-28',

                  hasFundingAgreementBeenSigned: true,
                },
                created_at: '2023-04-03T08:22:06.589845-08:00',
                created_by: 2,
                updated_at: '2023-04-03T08:22:06.589845-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                application_id: 6,
              },
              recordId: 'f4569f23-6afa-5492-89cf-cd0fc9c9ccb5',
              sessionSub: 'test-session-sub@idir',
              tableName: 'project_information_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-06-22T07:57:08.820373-08:00',
              familyName: 'Brown',
              item: 'application',
              givenName: 'Jimbo',
              op: 'INSERT',
              record: {
                id: 1,
                json_data: {
                  statementOfWorkUpload: [
                    {
                      uuid: 'just-about-anything',
                      name: 'CR Statement of Work.xlsx',
                    },
                  ],
                },
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                ccbc_number: null,
              },
              recordId: '5074afcc-87be-5d86-b3da-f0df836635b2',
              sessionSub: '8aeecc40e7e74568bd8fa94e440f7e0b@idir',
              tableName: 'change_request_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-06-22T07:57:08.820373-08:00',
              familyName: 'Bob',
              item: 'application',
              givenName: 'Jimbo',
              op: 'UPDATE',
              record: {
                id: 1,
                json_data: {
                  statementOfWorkUpload: [
                    {
                      uuid: 'just-about-anything',
                      name: 'CR Statement of Work.xlsx',
                    },
                  ],
                },
                updated_by: 3,
                updated_at: '2023-06-22T07:57:08.820373-08:00',
                archived_at: null,
                archived_by: null,
                ccbc_number: null,
              },
              recordId: '5074afcc-87be-5d86-b3da-f0df836635b2',
              sessionSub: '8aeecc40e7e74568bd8fa94e440f7e0b@idir',
              tableName: 'change_request_data',
              externalAnalyst: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-08-21T20:19:46.332698-07:00',
              externalAnalyst: null,
              familyName: 'Foo',
              givenName: 'Bar',
              item: null,
              op: 'INSERT',
              tableName: 'application_community_progress_report_data',
              record: {
                id: 1,
                json_data: {
                  dueDate: '2023-04-01',
                  dateReceived: '2023-04-20',
                },
                created_at: '2023-08-21T20:19:46.332698-07:00',
                created_by: 95,
                updated_at: '2023-08-21T20:19:46.332698-07:00',
                updated_by: 95,
                archived_at: null,
                archived_by: null,
                excel_data_id: null,
                application_id: 6,
              },
              recordId: 'fad31cb3-8a42-530b-ae5b-0a950e570ae4',
              oldRecord: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-08-21T21:15:56.178828-07:00',
              externalAnalyst: null,
              familyName: 'Foo',
              givenName: 'Bar',
              item: null,
              op: 'INSERT',
              tableName: 'application_community_progress_report_data',
              record: {
                id: 2,
                json_data: {
                  dueDate: '2023-08-01',
                  dateReceived: '2023-08-03',
                  progressReportFile: [
                    {
                      id: 716,
                      name: 'Community Progress Report_010002.xlsx',
                      size: 122870,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: '06152b7b-59d5-4ff2-bf3a-e155db5d29d0',
                    },
                  ],
                },
                created_at: '2023-08-21T21:15:56.178828-07:00',
                created_by: 95,
                updated_at: '2023-08-21T21:15:56.178828-07:00',
                updated_by: 95,
                archived_at: null,
                archived_by: null,
                excel_data_id: 1,
                application_id: 6,
              },
              recordId: '1699b4e8-fa3b-52f5-9f64-2502da91b827',
              oldRecord: null,
            },
            {
              applicationId: 6,
              createdAt: '2023-08-24T19:56:49.246157-07:00',
              externalAnalyst: null,
              familyName: 'Foo',
              item: null,
              givenName: 'Bar',
              op: 'UPDATE',
              tableName: 'application_community_progress_report_data',
              record: {
                id: 1,
                json_data: {
                  dueDate: '2023-08-01',
                  dateReceived: '2023-08-02',
                },
                created_at: '2023-08-24T19:56:49.246157-07:00',
                created_by: 95,
                updated_at: '2023-08-24T21:35:37.114692-07:00',
                updated_by: 95,
                archived_at: '2023-08-24T21:35:37.114692-07:00',
                archived_by: 95,
                excel_data_id: null,
                application_id: 6,
                history_operation: 'deleted',
              },
              oldRecord: {
                id: 1,
                json_data: {
                  dueDate: '2023-08-01',
                  dateReceived: '2023-08-02',
                },
                created_at: '2023-08-24T19:56:49.246157-07:00',
                created_by: 95,
                updated_at: '2023-08-24T21:35:37.114692-07:00',
                updated_by: 95,
                archived_at: '2023-08-24T21:35:37.114692-07:00',
                archived_by: 95,
                excel_data_id: null,
                application_id: 6,
                history_operation: 'created',
              },
              recordId: 'ee4a96e3-82ac-50a6-bdb9-7678fcaaf36a',
            },
            {
              applicationId: 1,
              createdAt: '2023-10-13T10:24:02.578323-07:00',
              externalAnalyst: null,
              familyName: 'bar',
              item: null,
              givenName: 'foo1',
              op: 'INSERT',
              record: {
                id: 1,
                json_data: {
                  claimsFile: [
                    {
                      id: 1,
                      name: 'claims.xlsx',
                      size: 2232925,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: '98f1f70a-129d-4bea-9b31-0aaa3b5d9bf0',
                    },
                  ],
                },
                created_at: '2023-10-13T10:24:02.578323-07:00',
                created_by: null,
                updated_at: '2023-10-13T10:24:02.578323-07:00',
                updated_by: null,
                archived_at: null,
                archived_by: null,
                excel_data_id: 1,
                application_id: 1,
                history_operation: 'created',
              },
              oldRecord: null,
              recordId: 'ee5b8bba-75e9-5fc1-9d00-76d7a7a78b7e',
              sessionSub: 'mockUser@ccbc_auth_user',
              tableName: 'application_claims_data',
            },
            {
              applicationId: 1,
              createdAt: '2023-10-13T10:24:15.055338-07:00',
              externalAnalyst: null,
              familyName: 'bar',
              item: null,
              givenName: 'foo1',
              op: 'INSERT',
              record: {
                id: 2,
                json_data: {
                  claimsFile: [
                    {
                      id: 2,
                      name: 'claims2.xlsx',
                      size: 2232925,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: '1f231b82-dc9f-436a-91e3-29eae73e3218',
                    },
                  ],
                },
                created_at: '2023-10-13T10:24:15.055338-07:00',
                created_by: null,
                updated_at: '2023-10-13T10:24:15.055338-07:00',
                updated_by: null,
                archived_at: null,
                archived_by: null,
                excel_data_id: 2,
                application_id: 1,
                history_operation: 'updated',
              },
              oldRecord: null,
              recordId: 'e91a44bb-3a85-5b2d-9e71-273d3317b650',
              sessionSub: 'mockUser@ccbc_auth_user',
              tableName: 'application_claims_data',
            },
            {
              applicationId: 1,
              createdAt: '2023-10-13T10:24:15.055338-07:00',
              externalAnalyst: null,
              familyName: 'bar',
              item: null,
              givenName: 'foo1',
              op: 'UPDATE',
              record: {
                id: 2,
                json_data: {
                  claimsFile: [
                    {
                      id: 2,
                      name: 'claims2.xlsx',
                      size: 2232925,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: '1f231b82-dc9f-436a-91e3-29eae73e3218',
                    },
                  ],
                },
                created_at: '2023-10-13T10:24:15.055338-07:00',
                created_by: null,
                updated_at: '2023-10-13T10:24:17.082474-07:00',
                updated_by: null,
                archived_at: '2023-10-13T10:24:17.082474-07:00',
                archived_by: null,
                excel_data_id: 2,
                application_id: 1,
                history_operation: 'deleted',
              },
              oldRecord: {
                id: 2,
                json_data: {
                  claimsFile: [
                    {
                      id: 2,
                      name: 'claims2.xlsx',
                      size: 2232925,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: '1f231b82-dc9f-436a-91e3-29eae73e3218',
                    },
                  ],
                },
                created_at: '2023-10-13T10:24:15.055338-07:00',
                created_by: null,
                updated_at: '2023-10-13T10:24:15.055338-07:00',
                updated_by: null,
                archived_at: null,
                archived_by: null,
                excel_data_id: 2,
                application_id: 1,
                history_operation: 'updated',
              },
              recordId: 'e91a44bb-3a85-5b2d-9e71-273d3317b650',
              sessionSub: 'mockUser@ccbc_auth_user',
              tableName: 'application_claims_data',
            },
            {
              applicationId: 1,
              createdAt: '2023-10-17T15:09:09.334683+00:00',
              externalAnalyst: null,
              familyName: 'bar',
              item: null,
              givenName: 'foo1',
              op: 'INSERT',
              record: {
                id: 1,
                json_data: {
                  dueDate: '2023-10-16',
                  milestoneFile: [
                    {
                      id: 1,
                      name: 'UBF-AA-00000-Milestone-Report.xlsx',
                      size: 964269,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: '08665265-023c-4a4d-b89d-2168f7d8cfde',
                    },
                  ],
                },
                created_at: '2023-10-17T15:09:09.334683+00:00',
                created_by: null,
                updated_at: '2023-10-17T15:09:09.334683+00:00',
                updated_by: null,
                archived_at: null,
                archived_by: null,
                excel_data_id: 1,
                application_id: 1,
                history_operation: 'created',
              },
              oldRecord: null,
              recordId: 'c4bf5e40-07f3-585a-96c8-a86e5db927b1',
              sessionSub: 'mockUser@ccbc_auth_user',
              tableName: 'application_milestone_data',
            },
            {
              applicationId: 1,
              createdAt: '2023-10-17T15:10:01.685138+00:00',
              externalAnalyst: null,
              familyName: 'bar',
              item: null,
              givenName: 'foo1',
              op: 'INSERT',
              record: {
                id: 2,
                json_data: {
                  dueDate: '2023-10-12',
                  milestoneFile: [
                    {
                      id: 1,
                      name: 'UBF-AA-00000-Milestone-Report.xlsx',
                      size: 964269,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: '08665265-023c-4a4d-b89d-2168f7d8cfde',
                    },
                  ],
                  evidenceOfCompletionFile: [
                    {
                      id: 2,
                      name: 'evidence.pdf',
                      size: 231818,
                      type: 'application/pdf',
                      uuid: '826c7066-0205-4472-9521-d4bd0407baf7',
                      uploadedAt: '2023-10-17T08:09:56.234-07:00',
                    },
                  ],
                },
                created_at: '2023-10-17T15:10:01.685138+00:00',
                created_by: null,
                updated_at: '2023-10-17T15:10:01.685138+00:00',
                updated_by: null,
                archived_at: null,
                archived_by: null,
                excel_data_id: 1,
                application_id: 1,
                history_operation: 'updated',
              },
              oldRecord: null,
              recordId: 'fdf3d9eb-4ed9-5a37-87f7-87a5417d5452',
              sessionSub: 'mockUser@ccbc_auth_user',
              tableName: 'application_milestone_data',
            },
            {
              applicationId: 1,
              createdAt: '2023-10-17T15:10:29.292655+00:00',
              externalAnalyst: null,
              familyName: 'bar',
              item: null,
              givenName: 'foo1',
              op: 'INSERT',
              record: {
                id: 3,
                json_data: {
                  dueDate: '2023-02-01',
                  milestoneFile: [
                    {
                      id: 3,
                      name: 'UBF-AA-00000-Milestone-Report.xlsx',
                      size: 964269,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: 'ff48ef85-991d-44de-a03d-b361f839e961',
                    },
                  ],
                },
                created_at: '2023-10-17T15:10:29.292655+00:00',
                created_by: null,
                updated_at: '2023-10-17T15:10:29.292655+00:00',
                updated_by: null,
                archived_at: null,
                archived_by: null,
                excel_data_id: 2,
                application_id: 1,
                history_operation: 'created',
              },
              oldRecord: null,
              recordId: '350d8bd6-2d13-5c90-bbf7-c42a6f9e2300',
              sessionSub: 'mockUser@ccbc_auth_user',
              tableName: 'application_milestone_data',
            },
            {
              applicationId: 1,
              createdAt: '2023-10-17T15:10:29.292655+00:00',
              externalAnalyst: null,
              familyName: 'bar',
              item: null,
              givenName: 'foo1',
              op: 'UPDATE',
              record: {
                id: 3,
                json_data: {
                  dueDate: '2023-02-01',
                  milestoneFile: [
                    {
                      id: 3,
                      name: 'UBF-AA-00000-Milestone-Report.xlsx',
                      size: 964269,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: 'ff48ef85-991d-44de-a03d-b361f839e961',
                    },
                  ],
                },
                created_at: '2023-10-17T15:10:29.292655+00:00',
                created_by: null,
                updated_at: '2023-10-17T15:16:56.17372+00:00',
                updated_by: null,
                archived_at: '2023-10-17T15:16:56.17372+00:00',
                archived_by: null,
                excel_data_id: 2,
                application_id: 1,
                history_operation: 'deleted',
              },
              oldRecord: {
                id: 3,
                json_data: {
                  dueDate: '2023-02-01',
                  milestoneFile: [
                    {
                      id: 3,
                      name: 'UBF-AA-00000-Milestone-Report.xlsx',
                      size: 964269,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: 'ff48ef85-991d-44de-a03d-b361f839e961',
                    },
                  ],
                },
                created_at: '2023-10-17T15:10:29.292655+00:00',
                created_by: null,
                updated_at: '2023-10-17T15:10:29.292655+00:00',
                updated_by: null,
                archived_at: null,
                archived_by: null,
                excel_data_id: 2,
                application_id: 1,
                history_operation: 'created',
              },
              recordId: '350d8bd6-2d13-5c90-bbf7-c42a6f9e2300',
              sessionSub: 'mockUser@ccbc_auth_user',
              tableName: 'application_milestone_data',
            },
            {
              applicationId: 1,
              createdAt: '2024-01-09T23:39:11.914878+00:00',
              externalAnalyst: null,
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 1,
                json_data: {
                  decision: {
                    ministerDate: '2024-01-09',
                    ministerDecision: 'Approved',
                    provincialRequested: 12345000.99,
                    ministerAnnouncement: 'Hold announcement',
                  },
                  response: {},
                  isedDecisionObj: {
                    isedDecision: 'No decision',
                  },
                  letterOfApproval: {},
                },
                created_at: '2024-01-09T23:39:11.914878+00:00',
                created_by: 3,
                updated_at: '2024-01-09T23:39:11.914878+00:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                application_id: 7,
              },
              oldRecord: null,
              recordId: 'd6431f27-b78d-5212-916d-380e0cce9583',
              sessionSub: 'test-session-sub@idir',
              tableName: 'conditional_approval_data',
            },
            {
              applicationId: 1,
              createdAt: '2024-01-09T23:52:12.82194+00:00',
              externalAnalyst: null,
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 2,
                json_data: {
                  decision: {
                    ministerDate: '2024-01-09',
                    ministerDecision: 'Approved',
                    provincialRequested: 12345000.99,
                    ministerAnnouncement: 'Hold announcement',
                  },
                  response: {
                    applicantResponse: 'Accepted',
                    statusApplicantSees: 'Conditionally Approved',
                  },
                  isedDecisionObj: {
                    isedDate: '2024-03-07',
                    isedDecision: 'Approved',
                    federalRequested: 111111,
                    isedAnnouncement: 'Announce immediately',
                  },
                  letterOfApproval: {
                    letterOfApprovalUpload: [
                      {
                        id: 75,
                        name: '1',
                        size: 0,
                        type: '',
                        uuid: '07f60e2b-fab8-4781-9405-b8a4bfb38574',
                        uploadedAt: '2024-01-09T15:52:10.431-08:00',
                      },
                    ],
                    letterOfApprovalDateSent: '2024-01-09',
                  },
                },
                created_at: '2024-01-09T23:52:12.82194+00:00',
                created_by: 3,
                updated_at: '2024-01-09T23:52:12.82194+00:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                application_id: 7,
              },
              oldRecord: null,
              recordId: 'd6431f27-b78d-5212-916d-380e0cce9583',
              sessionSub: 'test-session-sub@idir',
              tableName: 'conditional_approval_data',
            },
            {
              applicationId: 1,
              createdAt: '2024-01-12T18:06:46.967236+00:00',
              externalAnalyst: null,
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 1,
                created_at: '2024-01-12T18:06:46.967236+00:00',
                created_by: 3,
                updated_at: '2024-01-12T18:06:46.967236+00:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                project_type: 'lastMile',
                application_id: 7,
              },
              oldRecord: null,
              recordId: 'd6431f27-b78d-5212-916d-380e0cce9583',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_project_type',
            },
            {
              applicationId: 1,
              createdAt: '2024-01-12T18:27:07.444181+00:00',
              externalAnalyst: null,
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 3,
                created_at: '2024-01-12T18:27:07.444181+00:00',
                created_by: 3,
                updated_at: '2024-01-12T18:27:07.444181+00:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                project_type: 'lastMileAndTransport',
                application_id: 7,
              },
              oldRecord: null,
              recordId: 'd6431f27-b78d-5212-916d-380e0cce9583',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_project_type',
            },
            {
              applicationId: 1,
              createdAt: '2024-01-12T18:27:42.139106+00:00',
              externalAnalyst: null,
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 5,
                created_at: '2024-01-12T18:27:42.139106+00:00',
                created_by: 3,
                updated_at: '2024-01-12T18:27:42.139106+00:00',
                updated_by: 3,
                archived_at: null,
                archived_by: null,
                project_type: null,
                application_id: 7,
              },
              oldRecord: null,
              recordId: 'd6431f27-b78d-5212-916d-380e0cce9583',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_project_type',
            },
            {
              applicationId: 1,
              createdAt: '2024-01-12T18:27:42.139106+00:00',
              externalAnalyst: null,
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 5,
                created_at: '2024-01-12T18:27:42.139106+00:00',
                created_by: 3,
                updated_at: '2024-01-12T18:27:42.139106+00:00',
                updated_by: 3,
                eligible: 10,
                eligible_indigenous: 5,
                archived_at: null,
                archived_by: null,
                application_id: 7,
              },
              oldRecord: null,
              recordId: 'd6431f27-b78d-5212-916d-380e0cce9583',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_gis_assessment_hh',
            },
            {
              applicationId: 1,
              createdAt: '2024-01-12T18:27:42.139106+00:00',
              externalAnalyst: null,
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                projectTitle: 'newProjectTitle',
                organizationName: 'newOrganizationName',
              },
              recordId: 'asdfrewq123456789i0',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_sow_data',
            },
            {
              applicationId: 1,
              createdAt: '2024-01-13T18:27:42.139106+00:00',
              externalAnalyst: null,
              familyName: 'Bar',
              item: null,
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                projectTitle: 'newProjectTitleAgain',
                organizationName: 'newOrganizationNameRoundTwo',
              },
              recordId: 'asdfrewq123456789i0',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_sow_data',
            },
            {
              applicationId: 1,
              createdAt: '2024-07-31T14:42:33.523087+00:00',
              externalAnalyst: null,
              familyName: 'Foo',
              givenName: 'Bar',
              item: null,
              oldRecord: null,
              op: 'INSERT',
              record: {
                announced: true,
                application_id: 1,
                archived_at: null,
                archived_by: null,
                created_at: '2024-07-31T14:42:33.523087+00:00',
                created_by: 243,
                id: 1,
                updated_at: '2024-07-31T14:42:33.523087+00:00',
                updated_by: 243,
              },
              recordId: '48007280-d84e-565e-9697-ea2d4c156550',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_announced',
            },
            {
              applicationId: 1,
              createdAt: '2024-07-31T15:25:51.587461+00:00',
              externalAnalyst: null,
              familyName: 'Foo',
              givenName: 'Bar',
              item: null,
              oldRecord: null,
              op: 'INSERT',
              record: {
                announced: false,
                application_id: 1,
                archived_at: null,
                archived_by: null,
                created_at: '2024-07-31T15:25:51.587461+00:00',
                created_by: 243,
                id: 2,
                updated_at: '2024-07-31T15:25:51.587461+00:00',
                updated_by: 243,
              },
              recordId: 'e1cd0148-ab72-5e3f-b2d2-d7debd866bfc',
              sessionSub: 'test-session-sub@idir',
              tableName: 'application_announced',
            },
          ],
        },
        formData: {
          jsonData: {
            projectInformation: {
              projectTitle: 'originalProjectTitle',
            },
            organizationProfile: {
              organizationName: 'originalOrganizationName',
            },
          },
        },
      },
    };
  },
};

const mockShowHistory: FeatureResult<JSONValue> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_history',
};

const mockShowHistoryDetails: FeatureResult<JSONValue> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_history_details',
};

const pageTestingHelper = new PageTestingHelper<historyQuery>({
  pageComponent: History,
  compiledQuery: compiledhistoryQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1' },
    });
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowHistory);
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowHistoryDetails);
  });

  it('displays the title', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByRole('heading', { name: 'History' })).toBeVisible();
  });

  it('shows the correct status history for Received status', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusByTestId = screen.getAllByTestId('history-content-status');
    expect(statusByTestId[statusByTestId.length - 1]).toHaveTextContent(
      'The application was Received on Mar 3, 2023, 8:02 a.m.'
    );
  });

  it('shows the correct status history', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-status')[5]
    ).toHaveTextContent(
      'Foo Bar changed the Internal status to Screening on Mar 3, 2023, 8:02 a.m.'
    );
  });

  it('shows the correct assessment history', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-assessment')[0]
    ).toHaveTextContent(
      'Foo Bar updated the Screening Assessment on Mar 3, 2023, 9:50 a.m.'
    );

    expect(screen.getByText('TestNameHopefullyUnique')).toBeInTheDocument();
    expect(screen.getByText('Assigned To')).toBeInTheDocument();
    expect(
      screen.getByText('FileNameThatIsAlsoUniqueToScreening.xlsx')
    ).toBeInTheDocument();

    expect(
      screen.getAllByTestId('history-content-assessment')[5]
    ).toHaveTextContent(
      'Foo Bar updated the technical Assessment on Mar 3, 2023, 8:03 a.m.'
    );

    expect(
      screen.getAllByTestId('history-content-assessment')[4]
    ).toHaveTextContent(
      'Foo Bar updated the Project Management Assessment on Mar 3, 2023, 8:03 a.m.'
    );
  });

  it('shows the correct rfi history', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByTestId('history-content-rfi')[4]).toHaveTextContent(
      /Foo Bar saved RFI-CCBC-020001-1 on Mar 3, 2023, 8:03 a.m./
    );
  });

  it('shows the correct conditional approval history', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-conditional-approval')[0]
    ).toHaveTextContent(
      /Foo Bar saved the Conditional approval on Jan 9, 2024, 3:52 p.m./
    );

    expect(
      screen.getAllByTestId('history-content-conditional-approval')[1]
    ).toHaveTextContent(
      /Foo Bar saved the Conditional approval on Jan 9, 2024, 3:39 p.m./
    );
  });

  it('shows the correct application project type history', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-application_project_type')[0]
    ).toHaveTextContent(
      /Foo Bar changed Project Type to Unassigned from Last Mile & Transport on Jan 12, 2024, 10:27 a.m./
    );

    expect(
      screen.getAllByTestId('history-application_project_type')[1]
    ).toHaveTextContent(
      /Foo Bar changed Project Type to Last Mile & Transport from Last Mile on Jan 12, 2024, 10:27 a.m./
    );

    expect(
      screen.getAllByTestId('history-application_project_type')[2]
    ).toHaveTextContent(
      /Foo Bar set Project Type to Last Mile on Jan 12, 2024, 10:06 a.m./
    );
  });

  it('shows the correct community report history', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-community-progress-report')[1]
    ).toHaveTextContent(
      'The applicant created a Community Progress Report on Aug 21, 2023'
    );

    expect(
      screen.getAllByTestId('history-content-community-progress-report')[0]
    ).toHaveTextContent('The applicant deleted a Community Progress Report');
  });

  it('shows the correct history for editing an application', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-form-data')[3]
    ).toHaveTextContent(
      'Foo Bar edited the Application on Mar 3, 2023, 8:34 a.m.'
    );
  });

  it('shows the correct history for assign package', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-package')[0]
    ).toHaveTextContent(
      'Foo Bar added the application to a Package on Mar 6, 2023, 9:24 a.m.'
    );
  });

  it('shows the correct history for assign lead', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-analyst-lead')[1]
    ).toHaveTextContent(
      'Foo Bar assigned Lead to Foo Bar on Mar 6, 2023, 9:24 a.m.'
    );
  });

  it('shows the users full name when externalAnalyst is true', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-analyst-lead')[0]
    ).toHaveTextContent(
      'External Analyst assigned Lead to External Analyst on Mar 6, 2023, 9:24 a.m.'
    );
  });

  it('shows all 25 diff tables', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const diffTables = screen.getAllByTestId('diff-table');

    expect(diffTables.length).toBe(29);

    diffTables.forEach((table) => {
      expect(table).toBeVisible();
    });
  });

  it('shows the correct history for uploading gis analysis', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-form-data')[2]
    ).toHaveTextContent(
      'Foo Bar uploaded the GIS Analysis on Mar 3, 2023, 8:35 a.m.'
    );
  });

  it('shows the correct history for gis assessment hh', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-gis-assessment-hh')[0]
    ).toHaveTextContent(
      'Foo Bar updated the GIS Assessment Household Count on Jan 12, 2024, 10:27 a.m.'
    );
  });

  it('shows the correct history for change request', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-change-request')[1]
    ).toHaveTextContent(
      'Jimbo Brown created a Change Request on Jun 22, 2023, 8:57 a.m.'
    );
  });

  it('shows the correct history for an updated change request', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-change-request')[0]
    ).toHaveTextContent(
      'Jimbo Bob updated a Change Request on Jun 22, 2023, 8:57 a.m.'
    );
  });

  it('shows the correct history for updating gis analysis', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-form-data')[0]
    ).toHaveTextContent(
      'Foo Bar updated the GIS Analysis on Mar 3, 2023, 8:37 a.m.'
    );
  });

  it('shows one no diff message', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByTestId('no-diff-message')[0]).toBeVisible();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls the download on the attachment history with proper values', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const downloadLink = screen.getAllByTestId('history-attachment-link')[0];
    expect(downloadLink).toBeVisible();

    jest.spyOn(window, 'open').mockImplementation(() => window);

    await act(async () => {
      fireEvent.click(downloadLink);
    });

    expect(window.open).toHaveBeenCalledWith({}, '_blank');
  });

  it('shows the correct history for creating a claim', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const claimsHistory = screen.getAllByTestId('history-content-claims')[2];

    expect(claimsHistory).toHaveTextContent(
      /The applicant created a Claim & Progress Report on Oct 13, 2023, 10:24 a.m./
    );

    const claimHistoryFile = screen.getAllByTestId(
      'history-content-claims-file'
    )[1];

    expect(claimHistoryFile).toHaveTextContent(
      /Uploaded Claims & Progress Report Excel/
    );
    expect(claimHistoryFile).toHaveTextContent('claims.xlsx');
  });

  it('shows the correct history for updating a claim', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const claimsHistory = screen.getAllByTestId('history-content-claims')[1];

    expect(claimsHistory).toHaveTextContent(
      /The applicant updated a Claim & Progress Report on Oct 13, 2023, 10:24 a.m./
    );

    const claimHistoryFile = screen.getAllByTestId(
      'history-content-claims-file'
    )[0];

    expect(claimHistoryFile).toHaveTextContent(
      /Uploaded Claims & Progress Report Excel/
    );
    expect(claimHistoryFile).toHaveTextContent('claims2.xlsx');
  });

  it('shows the correct history for deleting a claim', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const claimsHistory = screen.getAllByTestId('history-content-claims')[0];

    expect(claimsHistory).toHaveTextContent(
      'The applicant deleted a Claim & Progress Report on Oct 13, 2023, 10:24 a.m.'
    );
  });

  it('shows the correct history for creating a milestone report', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const claimsHistory = screen.getAllByTestId(
      'history-content-milestone_data'
    )[3];

    expect(claimsHistory).toHaveTextContent(
      'The applicant created a Milestone Report on Oct 17, 2023, 8:09 a.m.'
    );

    const claimHistoryFile = screen.getAllByTestId(
      'history-content-milestone-file'
    )[0];

    expect(claimHistoryFile).toHaveTextContent(
      'Uploaded Milestone Report Excel'
    );
    expect(claimHistoryFile).toHaveTextContent(
      'UBF-AA-00000-Milestone-Report.xlsx'
    );
  });

  it('shows the correct history for updating a milestone report', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const claimsHistory = screen.getAllByTestId(
      'history-content-milestone_data'
    )[2];

    expect(claimsHistory).toHaveTextContent(
      'The applicant updated a Milestone Report on Oct 17, 2023, 8:10 a.m.'
    );

    const claimHistoryFile = screen.getAllByTestId(
      'history-content-milestone-evidence-file'
    )[0];

    expect(claimHistoryFile).toHaveTextContent(
      'Uploaded Milestone Completion Evidence'
    );
    expect(claimHistoryFile).toHaveTextContent('evidence.pdf');
  });

  it('shows the correct history for deleting a milestone report', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const claimsHistory = screen.getAllByTestId(
      'history-content-milestone_data'
    )[0];

    expect(claimsHistory).toHaveTextContent(
      'The applicant deleted a Milestone Report on Oct 17, 2023, 8:16 a.m.'
    );
    const claimHistoryFile = screen.getAllByTestId(
      'history-content-milestone-file'
    )[0];
    expect(claimHistoryFile).toHaveTextContent(
      'UBF-AA-00000-Milestone-Report.xlsx'
    );
  });

  it('shows the correct history for changing project title from sow upload', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const sowHistory = screen.getAllByTestId('history-content-sow-data')[0];

    expect(sowHistory).toHaveTextContent(
      'Foo Bar Uploaded the Sow file on Jan 13, 2024, 10:27 a.m'
    );

    // should show correct number of times
    expect(screen.getAllByTestId('history-content-sow-data').length).toBe(2);
  });

  it('shows the correct history for changing application announced status', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const sowHistory = screen.getAllByTestId('history-content-announced')[0];

    expect(sowHistory).toBeInTheDocument();

    expect(sowHistory).toHaveTextContent(
      'Bar Foo updated Announcement info on Jul 31, 2024, 8:25 a.m.'
    );
  });
});
