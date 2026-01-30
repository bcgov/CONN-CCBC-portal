import { screen } from '@testing-library/react';
import { NextPageContext } from 'next';
import { schema, schemaV2 } from 'formSchema';
import userEvent from '@testing-library/user-event';
import * as moduleApi from '@growthbook/growthbook-react';
import { withRelayOptions } from '../../../../pages/applicantportal/form/[id]/success';
import FormPage from '../../../../pages/applicantportal/form/[id]/[page]';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import compiledPageQuery, {
  PageQuery,
} from '../../../../__generated__/PageQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        status: 'draft',
        ccbcNumber: 'CCBC-010001',
        intakeByIntakeId: {
          ccbcIntakeNumber: 1,
          closeTimestamp: '2022-09-06T23:59:59-07:00',
          zones: [1, 2, 3, 4, 5],
          allowUnlistedFnLedZones: true,
        },
        projectName: 'Project testing title',
        updatedAt: '2022-08-15T16:43:28.973734-04:00',
        formData: {
          formByFormSchemaId: {
            jsonSchema: schema,
          },
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        intakeUsersByUserId: {
          nodes: [{ intakeId: 1 }],
        },
      },
      allForms: {
        nodes: [
          {
            rowId: 10,
            jsonSchema: schemaV2,
          },
        ],
      },
    };
  },
};

const mockForceLatestSchema: moduleApi.FeatureResult<moduleApi.JSONValue> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'draft_apps_use_latest_schema',
};

const mockAcceptedZones: moduleApi.FeatureResult<moduleApi.JSONValue> = {
  value: { '1': [1, 2, 3, 4, 5], '2': [6, 7, 8], '3': [9, 10] },
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'intake_zones_json',
};

const mockAllZones: moduleApi.FeatureResult<moduleApi.JSONValue> = {
  value: {
    '1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    '2': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    '3': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  },
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'intake_zones_json',
};

const pageTestingHelper = new PageTestingHelper<PageQuery>({
  pageComponent: FormPage,
  compiledQuery: compiledPageQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The form page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '1' },
    });
  });

  it('displays the correct nav links when user is logged in', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(
      screen.getByText('Estimated project employment')
    ).toBeInTheDocument();
  });

  it('does not display the alert or info banner when editing a draft application', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.queryByText(
        'You can no longer edit this application because it is withdrawn.'
      )
    ).toBeNull();

    expect(
      screen.queryByText('Edits are automatically saved and submitted.')
    ).toBeNull();
  });

  it('displays the info banner when editing a submitted application', () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'submitted',
            ccbcNumber: 'CCBC-010001',
            intakeByIntakeId: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-09-06T23:59:59-07:00',
              zones: [1, 2, 3, 4, 5],
              allowUnlistedFnLedZones: true,
            },
            projectName: 'Project testing title',
            updatedAt: '2022-08-15T16:43:28.973734-04:00',
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
            },
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };
    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText('Edits are automatically saved and submitted.')
    ).toBeInTheDocument();
  });

  it('displays the alert banner when editing a withdrawn application', () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'withdrawn',
            ccbcNumber: 'CCBC-010002',
            intakeByIntakeId: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-09-06T23:59:59-07:00',
              zones: [1, 2, 3, 4, 5],
              allowUnlistedFnLedZones: true,
            },
            projectName: 'Project testing title',
            updatedAt: '2022-08-15T16:43:28.973734-04:00',
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
            },
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };

    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        'You can no longer edit this application because it is withdrawn.'
      )
    ).toBeInTheDocument();
  });
  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/form/1/1',
      },
    } as NextPageContext;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/applicantportal',
      },
    });
  });

  it('uses the latest schema if the flag is on and estimated project employment is not present', async () => {
    // jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockForceLatestSchema);
    jest.spyOn(moduleApi, 'useFeature').mockImplementation((id) => {
      if (id === 'intake_zones_json') {
        return mockAcceptedZones;
      }
      return mockForceLatestSchema;
    });

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Benefits')).toBeInTheDocument();

    const estimatedProjectEmployment = screen.queryByText(
      'Estimated project employment'
    );

    expect(estimatedProjectEmployment).toBeNull();
  });

  it('shows accepted project areas based on the open intake if application status is draft', async () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'draft',
            ccbcNumber: 'CCBC-010001',
            projectName: 'Project testing title',
            updatedAt: '2022-08-15T16:43:28.973734-04:00',
            intakeByIntakeId: {
              ccbcIntakeNumber: 3,
              closeTimestamp: '2022-09-06T23:59:59-07:00',
              zones: [9, 10],
              allowUnlistedFnLedZones: true,
            },
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
            },
          },
          allForms: {
            nodes: [
              {
                rowId: 10,
                jsonSchema: schemaV2,
              },
            ],
          },
          openIntake: {
            closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
            ccbcIntakeNumber: 3,
            zones: [9, 10],
            allowUnlistedFnLedZones: true,
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAcceptedZones);

    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    const projectAreasText = screen.getByText(/within zones 9,10/);
    expect(projectAreasText).toBeInTheDocument();
  });

  it('shows accepted project areas based on the latest intake if application status is draft', async () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'draft',
            ccbcNumber: 'CCBC-010001',
            projectName: 'Project testing title',
            updatedAt: '2022-08-15T16:43:28.973734-04:00',
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
            },
            intakeByIntakeId: null,
          },
          allForms: {
            nodes: [
              {
                rowId: 10,
                jsonSchema: schemaV2,
              },
            ],
          },
          openIntake: null,
          allIntakes: {
            edges: [
              {
                node: {
                  ccbcIntakeNumber: 3,
                  closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
                  zones: [9, 10],
                  allowUnlistedFnLedZones: true,
                },
              },
            ],
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAcceptedZones);

    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    const projectAreasText = screen.getByText(/within zones 9,10/);
    expect(projectAreasText).toBeInTheDocument();
  });

  it('shows non-first-nation-led project area messgae when allowUnlistedFnLedZones is false', async () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'draft',
            ccbcNumber: 'CCBC-010001',
            projectName: 'Project testing title',
            updatedAt: '2022-08-15T16:43:28.973734-04:00',
            intakeByIntakeId: null,
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
            },
          },
          allForms: {
            nodes: [
              {
                rowId: 10,
                jsonSchema: schemaV2,
              },
            ],
          },
          openIntake: {
            closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
            ccbcIntakeNumber: 3,
            zones: [9, 10],
            allowUnlistedFnLedZones: false,
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        /IMPORTANT: For Intake 3, CCBC is considering the following projects:/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/within zones 9,10/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /Projects that are First Nation-led or First Nation-supported/i
      )
    ).not.toBeInTheDocument();
  });

  it('shows intake 4 project area text', async () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'draft',
            ccbcNumber: 'CCBC-010001',
            projectName: 'Project testing title',
            updatedAt: '2022-08-15T16:43:28.973734-04:00',
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
            },
            intakeByIntakeId: null,
          },
          allForms: {
            nodes: [
              {
                rowId: 10,
                jsonSchema: schemaV2,
              },
            ],
          },
          openIntake: null,
          allIntakes: {
            edges: [
              {
                node: {
                  ccbcIntakeNumber: 4,
                  closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
                  zones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                  allowUnlistedFnLedZones: true,
                },
              },
            ],
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAcceptedZones);

    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    const projectAreasText = screen.getByText(
      /CCBC will accept applications for all eligible areas in the Province/
    );
    expect(projectAreasText).toBeInTheDocument();
  });

  it('shows first-nation-led acceptance message for intake 4 when allowUnlistedFnLedZones is true', async () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'draft',
            ccbcNumber: 'CCBC-010001',
            projectName: 'Project testing title',
            updatedAt: '2022-08-15T16:43:28.973734-04:00',
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
            },
            intakeByIntakeId: null,
          },
          allForms: {
            nodes: [
              {
                rowId: 10,
                jsonSchema: schemaV2,
              },
            ],
          },
          openIntake: null,
          allIntakes: {
            edges: [
              {
                node: {
                  ccbcIntakeNumber: 4,
                  closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
                  zones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                  allowUnlistedFnLedZones: true,
                },
              },
            ],
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        /Projects that are First Nation-led or First Nation-supported/i
      )
    ).toBeInTheDocument();
  });

  it('does not show FN-led acceptance copy for intake 4 when allowUnlistedFnLedZones is false', async () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'draft',
            ccbcNumber: 'CCBC-010001',
            projectName: 'Project testing title',
            updatedAt: '2022-08-15T16:43:28.973734-04:00',
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
            },
            intakeByIntakeId: null,
          },
          allForms: {
            nodes: [
              {
                rowId: 10,
                jsonSchema: schemaV2,
              },
            ],
          },
          openIntake: null,
          allIntakes: {
            edges: [
              {
                node: {
                  ccbcIntakeNumber: 4,
                  closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
                  zones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                  allowUnlistedFnLedZones: false,
                },
              },
            ],
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    expect(
      screen.queryByText(
        /Projects that are First Nation-led or First Nation-supported/i
      )
    ).not.toBeInTheDocument();
  });

  it('shows accepted project areas and handles modal', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAcceptedZones);

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const projectAreasText = screen.getByText(
      new RegExp(`within zones ${mockAcceptedZones.value?.[1].toString()}`)
    );
    expect(projectAreasText).toBeInTheDocument();

    const areas = screen.getAllByLabelText(
      'Referring to the project zones (application guide Annex 6), which zone(s) will this project be conducted in?'
    );
    expect(areas).toHaveLength(14);

    await userEvent.click(areas[5]);

    expect(
      screen.getByText(
        'For this intake, CCBC is considering projects that are in Zones 1, 2, 3, 4, or 5 if the project is not First Nations-led or First Nations-supported.'
      )
    ).toBeInTheDocument();

    const modalOkButton = screen.getByTestId('project-modal-ok');

    await userEvent.click(modalOkButton);
  });

  it('project area page should warn after submission on geographic area change', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationId',
          status: 'submitted',
          intakeByIntakeId: {
            ccbcIntakeNumber: 3,
            closeTimestamp: '2022-09-06T23:59:59-07:00',
            zones: [9, 10],
            allowUnlistedFnLedZones: true,
          },
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            jsonData: {
              review: {
                acknowledgeIncomplete: true,
              },
              submission: {
                submissionDate: '2023-12-28',
                submissionTitle: 'asdf',
                submissionCompletedBy: 'asdf',
                submissionCompletedFor: 'asdf',
              },
              projectArea: {
                geographicArea: [3],
                firstNationsLed: false,
              },
              techSolution: {
                systemDesign: 'asdfd',
              },
              projectFunding: {
                fundingRequestedCCBC2223: 111,
                totalFundingRequestedCCBC: 111,
                totalApplicantContribution: null,
              },
              acknowledgements: {
                acknowledgementsList: [
                  'The Applicant acknowledges that it is under no obligation or prohibition, nor is it subject to, or threatened by any actions, suits or proceedings, which could or would affect its ability to implement this proposed Project.',
                  'The Applicant acknowledges that the Program may collect and share Applicant information for purposes that include making enquiries of such persons, firms, corporations, federal and provincial government agencies/departments/ministries, and non-profit organizations as the Program deems necessary in order to reach a decision on this proposed project.',
                  'The Applicant acknowledges that any person, who is required to be registered pursuant to the Lobbyists Transparency Act (British Columbia) or the Lobbying Act (Canada), including consultant and in-house lobbyists, must be registered pursuant to, and comply with, those Acts as applicable.',
                  'The Applicant acknowledges that, where applicable, the Project may require an assessment under the Impact Assessment Act (Canada) or the Environmental Assessment Act (British Columbia).',
                  'The Applicant recognizes that there is a duty to consult Indigenous groups if a funded Project may undertake infrastructure in, or affecting, an Indigenous community, and the Applicant understands that it must provide such information and assistance to the Province or Federal government in connection with such consultation as may reasonably be required, including, but not limited to, those obligations with respect to Indigenous consultation which may be set forth in any Funding Agreement.',
                  'The Applicant acknowledges that any current or former public officer holder or public servant employed by the Applicant must comply with the provisions of the Standards of Conduct for BC Public Service employees, the Disclosing a Conflict of Interest: Employee Guideline & Disclosure Form (British Columbia), the Members’ Conflict of Interest Act (British Columbia), the Values and Ethics Code for the Public Service (Canada), the Policy on Conflict of Interest and Post-Employment (Canada), and the Conflict of Interest Act (Canada), as applicable.',
                  'The Applicant understands that all costs incurred in the preparation and submission of the application shall be wholly absorbed by the Applicant.',
                  'The Applicant understands that the Program reserves the right to make partial awards and to negotiate project scope changes with Applicants.',
                  'The Applicant understands that the Program is a discretionary program subject to available funding, and that submission of a complete application, meeting any or all of the eligibility criteria, does not guarantee that funding will be granted. All Applicants whose Projects are approved for funding will be notified in writing.',
                  'The Applicant acknowledges that it must ensure compliance with any applicable Canadian national security requirements as defined and/or administered by the Canadian security authorities, and any Provincial security requirements as defined and/or administered by the Province.',
                  'The Applicant acknowledges that it must have the managerial and financial capacity to deliver this proposed project on time and within budget and to maintain the infrastructure and services on an ongoing basis for five years after project completion.',
                  'The Applicant confirms that it is requesting the lowest possible Program contribution amount required to make this proposed Project financially viable.',
                  'The Applicant acknowledges that information provided in this Application Form (including attachments) may be shared between the Province and the Government of Canada and other levels of government to promote the Program and maximize the benefits to Canadian citizens and permanent residents.',
                  'The Applicant acknowledges that all activities required for this proposed Project must comply with all applicable federal, provincial, and territorial laws, regulations, municipal and other local by-laws.',
                  'The Applicant acknowledges that knowingly making any false statements or misrepresentations, including by omission, in an application may affect its eligibility and may result in the revocation of funding approval.',
                  'The Applicant acknowledges that information submitted in an application is subject to the Access to Information Act (Canada) or the Freedom of Information and Protection of Privacy Act (BC), as applicable.',
                  'The Applicant confirms that, to the best of its knowledge, the information submitted in this application is true and correct as of the date of submission.',
                ],
              },
              projectInformation: {
                projectTitle: 'asdf',
                projectDescription: 'asdfdsa',
                geographicAreaDescription: 'asdf',
              },
              organizationProfile: {
                organizationName: 'asdf',
              },
              existingNetworkCoverage: {
                hasProvidedExitingNetworkCoverage:
                  'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
              },
            },
          },
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
          },
        };
      },
    };
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });
    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    const geographicArea = screen.getAllByRole('checkbox')[7];

    await userEvent.click(geographicArea);

    const modal = screen.getByText(
      /Invalid selection. You have indicated that this project is not led/i
    );

    expect(modal).toBeInTheDocument();
  });
  it('project area page should warn after submission on first nations question change', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationId',
          status: 'submitted',
          intakeByIntakeId: {
            ccbcIntakeNumber: 3,
            closeTimestamp: '2022-09-06T23:59:59-07:00',
            zones: [9, 10],
            allowUnlistedFnLedZones: true,
          },
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
              rowId: 1,
              updatedAt: 'asdf',
            },
            jsonData: {
              review: {
                acknowledgeIncomplete: true,
              },
              submission: {
                submissionDate: '2023-12-28',
                submissionTitle: 'asdf',
                submissionCompletedBy: 'asdf',
                submissionCompletedFor: 'asdf',
              },
              projectArea: {
                geographicArea: [8],
                firstNationsLed: true,
              },
            },
          },
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
          },
        };
      },
    };
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAcceptedZones);
    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    const fnQuestionNo = screen.getAllByLabelText('No')[0];

    await userEvent.click(fnQuestionNo);
    // original data is saved, change is rejected
    pageTestingHelper.expectMutationToBeCalled(
      'updateApplicationFormMutation',
      {
        input: {
          jsonData: {
            review: {
              acknowledgeIncomplete: true,
            },
            submission: {
              submissionDate: '2023-12-28',
              submissionTitle: 'asdf',
              submissionCompletedBy: 'asdf',
              submissionCompletedFor: 'asdf',
            },
            projectArea: {
              geographicArea: [8],
              firstNationsLed: true,
            },
          },
          lastEditedPage: 'projectArea',
          formDataRowId: expect.anything(),
          clientUpdatedAt: expect.anything(),
        },
      }
    );
    expect(
      screen.queryByText(/Invalid selection. Please first choose from Zones/i)
    ).not.toBeInTheDocument();
  });

  it('project area page should not allow null on geographic area after submission', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationId',
          status: 'submitted',
          intakeByIntakeId: {
            ccbcIntakeNumber: 3,
            closeTimestamp: '2022-09-06T23:59:59-07:00',
          },
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            jsonData: {
              review: {
                acknowledgeIncomplete: true,
              },
              submission: {
                submissionDate: '2023-12-28',
                submissionTitle: 'asdf',
                submissionCompletedBy: 'asdf',
                submissionCompletedFor: 'asdf',
              },
              projectArea: {
                geographicArea: [3],
                firstNationsLed: false,
              },
              techSolution: {
                systemDesign: 'asdfd',
              },
              projectFunding: {
                fundingRequestedCCBC2223: 111,
                totalFundingRequestedCCBC: 111,
                totalApplicantContribution: null,
              },
              acknowledgements: {
                acknowledgementsList: [
                  'The Applicant acknowledges that it is under no obligation or prohibition, nor is it subject to, or threatened by any actions, suits or proceedings, which could or would affect its ability to implement this proposed Project.',
                  'The Applicant acknowledges that the Program may collect and share Applicant information for purposes that include making enquiries of such persons, firms, corporations, federal and provincial government agencies/departments/ministries, and non-profit organizations as the Program deems necessary in order to reach a decision on this proposed project.',
                  'The Applicant acknowledges that any person, who is required to be registered pursuant to the Lobbyists Transparency Act (British Columbia) or the Lobbying Act (Canada), including consultant and in-house lobbyists, must be registered pursuant to, and comply with, those Acts as applicable.',
                  'The Applicant acknowledges that, where applicable, the Project may require an assessment under the Impact Assessment Act (Canada) or the Environmental Assessment Act (British Columbia).',
                  'The Applicant recognizes that there is a duty to consult Indigenous groups if a funded Project may undertake infrastructure in, or affecting, an Indigenous community, and the Applicant understands that it must provide such information and assistance to the Province or Federal government in connection with such consultation as may reasonably be required, including, but not limited to, those obligations with respect to Indigenous consultation which may be set forth in any Funding Agreement.',
                  'The Applicant acknowledges that any current or former public officer holder or public servant employed by the Applicant must comply with the provisions of the Standards of Conduct for BC Public Service employees, the Disclosing a Conflict of Interest: Employee Guideline & Disclosure Form (British Columbia), the Members’ Conflict of Interest Act (British Columbia), the Values and Ethics Code for the Public Service (Canada), the Policy on Conflict of Interest and Post-Employment (Canada), and the Conflict of Interest Act (Canada), as applicable.',
                  'The Applicant understands that all costs incurred in the preparation and submission of the application shall be wholly absorbed by the Applicant.',
                  'The Applicant understands that the Program reserves the right to make partial awards and to negotiate project scope changes with Applicants.',
                  'The Applicant understands that the Program is a discretionary program subject to available funding, and that submission of a complete application, meeting any or all of the eligibility criteria, does not guarantee that funding will be granted. All Applicants whose Projects are approved for funding will be notified in writing.',
                  'The Applicant acknowledges that it must ensure compliance with any applicable Canadian national security requirements as defined and/or administered by the Canadian security authorities, and any Provincial security requirements as defined and/or administered by the Province.',
                  'The Applicant acknowledges that it must have the managerial and financial capacity to deliver this proposed project on time and within budget and to maintain the infrastructure and services on an ongoing basis for five years after project completion.',
                  'The Applicant confirms that it is requesting the lowest possible Program contribution amount required to make this proposed Project financially viable.',
                  'The Applicant acknowledges that information provided in this Application Form (including attachments) may be shared between the Province and the Government of Canada and other levels of government to promote the Program and maximize the benefits to Canadian citizens and permanent residents.',
                  'The Applicant acknowledges that all activities required for this proposed Project must comply with all applicable federal, provincial, and territorial laws, regulations, municipal and other local by-laws.',
                  'The Applicant acknowledges that knowingly making any false statements or misrepresentations, including by omission, in an application may affect its eligibility and may result in the revocation of funding approval.',
                  'The Applicant acknowledges that information submitted in an application is subject to the Access to Information Act (Canada) or the Freedom of Information and Protection of Privacy Act (BC), as applicable.',
                  'The Applicant confirms that, to the best of its knowledge, the information submitted in this application is true and correct as of the date of submission.',
                ],
              },
              projectInformation: {
                projectTitle: 'asdf',
                projectDescription: 'asdfdsa',
                geographicAreaDescription: 'asdf',
              },
              organizationProfile: {
                organizationName: 'asdf',
              },
              existingNetworkCoverage: {
                hasProvidedExitingNetworkCoverage:
                  'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
              },
            },
          },
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
          },
        };
      },
    };
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });
    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    const geographicArea = screen.getAllByRole('checkbox')[3];

    expect(geographicArea).toBeChecked();

    await userEvent.click(geographicArea);

    expect(geographicArea).toBeChecked();
  });

  it('project area page should not allow null on geographic area after submission even when first nation led', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationId',
          status: 'submitted',
          intakeByIntakeId: {
            ccbcIntakeNumber: 3,
            closeTimestamp: '2022-09-06T23:59:59-07:00',
          },
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            jsonData: {
              review: {
                acknowledgeIncomplete: true,
              },
              submission: {
                submissionDate: '2023-12-28',
                submissionTitle: 'asdf',
                submissionCompletedBy: 'asdf',
                submissionCompletedFor: 'asdf',
              },
              projectArea: {
                geographicArea: [3],
                firstNationsLed: true,
              },
              techSolution: {
                systemDesign: 'asdfd',
              },
              projectFunding: {
                fundingRequestedCCBC2223: 111,
                totalFundingRequestedCCBC: 111,
                totalApplicantContribution: null,
              },
              acknowledgements: {
                acknowledgementsList: [
                  'The Applicant acknowledges that it is under no obligation or prohibition, nor is it subject to, or threatened by any actions, suits or proceedings, which could or would affect its ability to implement this proposed Project.',
                  'The Applicant acknowledges that the Program may collect and share Applicant information for purposes that include making enquiries of such persons, firms, corporations, federal and provincial government agencies/departments/ministries, and non-profit organizations as the Program deems necessary in order to reach a decision on this proposed project.',
                  'The Applicant acknowledges that any person, who is required to be registered pursuant to the Lobbyists Transparency Act (British Columbia) or the Lobbying Act (Canada), including consultant and in-house lobbyists, must be registered pursuant to, and comply with, those Acts as applicable.',
                  'The Applicant acknowledges that, where applicable, the Project may require an assessment under the Impact Assessment Act (Canada) or the Environmental Assessment Act (British Columbia).',
                  'The Applicant recognizes that there is a duty to consult Indigenous groups if a funded Project may undertake infrastructure in, or affecting, an Indigenous community, and the Applicant understands that it must provide such information and assistance to the Province or Federal government in connection with such consultation as may reasonably be required, including, but not limited to, those obligations with respect to Indigenous consultation which may be set forth in any Funding Agreement.',
                  'The Applicant acknowledges that any current or former public officer holder or public servant employed by the Applicant must comply with the provisions of the Standards of Conduct for BC Public Service employees, the Disclosing a Conflict of Interest: Employee Guideline & Disclosure Form (British Columbia), the Members’ Conflict of Interest Act (British Columbia), the Values and Ethics Code for the Public Service (Canada), the Policy on Conflict of Interest and Post-Employment (Canada), and the Conflict of Interest Act (Canada), as applicable.',
                  'The Applicant understands that all costs incurred in the preparation and submission of the application shall be wholly absorbed by the Applicant.',
                  'The Applicant understands that the Program reserves the right to make partial awards and to negotiate project scope changes with Applicants.',
                  'The Applicant understands that the Program is a discretionary program subject to available funding, and that submission of a complete application, meeting any or all of the eligibility criteria, does not guarantee that funding will be granted. All Applicants whose Projects are approved for funding will be notified in writing.',
                  'The Applicant acknowledges that it must ensure compliance with any applicable Canadian national security requirements as defined and/or administered by the Canadian security authorities, and any Provincial security requirements as defined and/or administered by the Province.',
                  'The Applicant acknowledges that it must have the managerial and financial capacity to deliver this proposed project on time and within budget and to maintain the infrastructure and services on an ongoing basis for five years after project completion.',
                  'The Applicant confirms that it is requesting the lowest possible Program contribution amount required to make this proposed Project financially viable.',
                  'The Applicant acknowledges that information provided in this Application Form (including attachments) may be shared between the Province and the Government of Canada and other levels of government to promote the Program and maximize the benefits to Canadian citizens and permanent residents.',
                  'The Applicant acknowledges that all activities required for this proposed Project must comply with all applicable federal, provincial, and territorial laws, regulations, municipal and other local by-laws.',
                  'The Applicant acknowledges that knowingly making any false statements or misrepresentations, including by omission, in an application may affect its eligibility and may result in the revocation of funding approval.',
                  'The Applicant acknowledges that information submitted in an application is subject to the Access to Information Act (Canada) or the Freedom of Information and Protection of Privacy Act (BC), as applicable.',
                  'The Applicant confirms that, to the best of its knowledge, the information submitted in this application is true and correct as of the date of submission.',
                ],
              },
              projectInformation: {
                projectTitle: 'asdf',
                projectDescription: 'asdfdsa',
                geographicAreaDescription: 'asdf',
              },
              organizationProfile: {
                organizationName: 'asdf',
              },
              existingNetworkCoverage: {
                hasProvidedExitingNetworkCoverage:
                  'I have provided existing Network information and/or Coverage to ISED or the CRTC in the past 12 months',
              },
            },
          },
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
          },
        };
      },
    };
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });
    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    const geographicArea = screen.getAllByRole('checkbox')[3];

    expect(geographicArea).toBeChecked();

    await userEvent.click(geographicArea);

    expect(geographicArea).toBeChecked();
  });

  it('handles modal correctly when first nation based and not an available zone', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAcceptedZones);

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const areas = screen.getAllByLabelText(
      'Referring to the project zones (application guide Annex 6), which zone(s) will this project be conducted in?'
    );
    expect(areas).toHaveLength(14);

    const fnQuestion = screen.getAllByLabelText('Yes')[0];

    await userEvent.click(fnQuestion);
    await userEvent.click(areas[5]);

    expect(
      screen.queryByText(
        'For this intake, CCBC is considering projects that are in Zones 1, 2, 3, 4, or 5 if the project is not First Nations-led or First Nations-supported.'
      )
    ).not.toBeInTheDocument();
  });

  it('handles modal correctly when not first nation based and not an available zone', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAcceptedZones);

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const areas = screen.getAllByLabelText(
      'Referring to the project zones (application guide Annex 6), which zone(s) will this project be conducted in?'
    );
    expect(areas).toHaveLength(14);

    const fnQuestion = screen.getAllByLabelText('No')[0];

    await userEvent.click(fnQuestion);
    await userEvent.click(areas[5]);

    expect(
      screen.getByText(
        'For this intake, CCBC is considering projects that are in Zones 1, 2, 3, 4, or 5 if the project is not First Nations-led or First Nations-supported.'
      )
    ).toBeInTheDocument();

    const modalOkButton = screen.getByTestId('project-modal-ok');

    await userEvent.click(modalOkButton);
  });

  it('should not show modal if first nations led no if intake is all zone permitted', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAllZones);

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const fnQuestionNo = screen.getAllByLabelText('No')[0];

    await userEvent.click(fnQuestionNo);

    expect(
      screen.queryByText(
        'For this intake, CCBC is considering projects that are in Zones 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, or 14 if the project is not First Nations-led or First Nations-supported.'
      )
    ).not.toBeInTheDocument();
  });
});
