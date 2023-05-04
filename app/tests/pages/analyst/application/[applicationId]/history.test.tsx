import { screen } from '@testing-library/react';
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
                json_data: {},
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
                json_data: {},
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
                json_data: {},
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
              createdAt: '2023-03-03T08:06:16.628756-08:00',
              familyName: 'Bar',
              item: '["Technical", "Missing files or information"]',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 7,
                json_data: {},
                created_at: '2023-03-03T08:06:16.628756-08:00',
                created_by: 2,
                rfi_number: 'CCBC-020001-1',
                updated_at: '2023-03-03T08:06:16.628756-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                rfi_data_status_type_id: 'draft',
              },
              recordId: '668be64e-f279-5c85-baca-e3681f609912',
              sessionSub: 'test-session-sub@idir',
              tableName: 'rfi_data',
            },
            {
              applicationId: 6,
              createdAt: '2023-03-03T08:22:17.13179-08:00',
              familyName: 'Bar',
              item: '["Technical", "Missing files or information"]',
              givenName: 'Foo',
              op: 'INSERT',
              record: {
                id: 8,
                json_data: {},
                created_at: '2023-03-03T08:22:17.13179-08:00',
                created_by: 2,
                rfi_number: 'CCBC-020001-1',
                updated_at: '2023-03-03T08:22:17.13179-08:00',
                updated_by: 2,
                archived_at: null,
                archived_by: null,
                rfi_data_status_type_id: 'draft',
              },
              recordId: '1410a060-5616-50cc-8792-5aa220a3346f',
              sessionSub: 'test-session-sub@idir',
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
          ],
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
      'Foo Bar changed the status to Screening on Mar 3, 2023, 8:02 a.m.'
    );
  });

  it('shows the correct assessment history', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-assessment')[0]
    ).toHaveTextContent(
      'Foo Bar saved the screening Assessment on Mar 3, 2023, 9:50 a.m.'
    );

    expect(
      screen.getAllByTestId('history-content-assessment')[5]
    ).toHaveTextContent(
      'Foo Bar saved the technical Assessment on Mar 3, 2023, 8:03 a.m.'
    );

    expect(
      screen.getAllByTestId('history-content-assessment')[4]
    ).toHaveTextContent(
      'Foo Bar saved the Project Management Assessment on Mar 3, 2023, 8:03 a.m.'
    );
  });

  it('shows the correct rfi history', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByTestId('history-content-rfi')[3]).toHaveTextContent(
      'Foo Bar saved RFI-CCBC-020001-1 on Mar 3, 2023, 8:03 a.m.'
    );
  });

  it('shows the correct applicant reply rfi history', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-attachment')[0]
    ).toHaveTextContent(
      'The applicant uploaded a file on Mar 3, 2023, 8:05 a.m.'
    );

    expect(screen.getAllByTestId('history-content-rfi')[2]).toHaveTextContent(
      'The applicant saved RFI-CCBC-020001-1 on Mar 3, 2023, 8:05 a.m.'
    );
  });

  it('shows the correct history for editing an application', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByTestId('history-content-form-data')[0]
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

  it('shows all 12 diff tables', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const diffTables = screen.getAllByTestId('diff-table');

    expect(diffTables.length).toBe(11);

    diffTables.forEach((table) => {
      expect(table).toBeVisible();
    });
  });

  it('shows one no diff message', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('no-diff-message')).toBeVisible();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
