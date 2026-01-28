import { screen } from '@testing-library/react';
import * as moduleApi from '@growthbook/growthbook-react';
import { FeatureResult, JSONValue } from '@growthbook/growthbook-react';
import userEvent from '@testing-library/user-event';
import { schema } from 'formSchema';
import Dashboard, {
  withRelayOptions,
} from '../../../pages/applicantportal/dashboard';
import PageTestingHelper from '../../utils/pageTestingHelper';
import compileddashboardQuery, {
  dashboardQuery,
} from '../../../__generated__/dashboardQuery.graphql';

const openedIntakeMessage =
  'New applications will be accepted after updates to ISED‘s Eligibility Mapping tool are released.';
const closedIntakeMessage = 'Applications are not currently being accepted.';

const mockOpenIntakeData: JSONValue = {
  variant: 'warning',
  text: openedIntakeMessage,
  displayOpenDate: false,
};
const mockClosedIntakeData: JSONValue = {
  variant: 'warning',
  text: closedIntakeMessage,
  displayOpenDate: false,
};

const mockInternalIntakeClosed: FeatureResult<boolean> = {
  value: false,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'internal_intake',
};
const mockInternalIntakeOpen: FeatureResult<boolean> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'internal_intake',
};

const mockOpenIntake: FeatureResult<JSONValue> = {
  value: mockOpenIntakeData,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'open_intake_alert',
};
const mockClosedIntake: FeatureResult<JSONValue> = {
  value: mockClosedIntakeData,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'open_intake_alert',
};

const mockSubtractedValue: FeatureResult<JSONValue> = {
  value: 30,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_subtracted_time',
};

const mockQueryPayload = {
  Query() {
    return {
      allApplications: {
        edges: [
          {
            node: {
              id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
              rowId: 2,
              owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              status: 'withdrawn',
              projectName: null,
              ccbcNumber: 'CCBC-010001',
              formData: {
                lastEditedPage: '',
                isEditable: false,
                formByFormSchemaId: {
                  jsonSchema: schema,
                },
              },
              intakeByIntakeId: {
                ccbcIntakeNumber: 1,
                closeTimestamp: '2022-09-09T13:49:23.513427-07:00',
                openTimestamp: '2022-07-25T00:00:00-07:00',
              },
            },
          },
          {
            node: {
              id: 'WyJhcHBsaWNhdGlvbnMiLDJf',
              rowId: 3,
              owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              status: 'Received',
              projectName: 'test',
              ccbcNumber: 'CCBC-020002',
              formData: {
                lastEditedPage: '',
                isEditable: false,
                formByFormSchemaId: {
                  jsonSchema: schema,
                },
              },
              intakeByIntakeId: {
                ccbcIntakeNumber: 2,
              },
            },
          },
          {
            node: {
              id: 'WyJhcHBsaWNhdGlvbnMiLDJF',
              rowId: 4,
              owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              status: 'draft',
              projectName: 'test',
              ccbcNumber: null,
              formData: {
                lastEditedPage: '',
                isEditable: false,
                formByFormSchemaId: {
                  jsonSchema: schema,
                },
              },
              intakeByIntakeId: {
                ccbcIntakeNumber: 3,
              },
            },
          },
        ],
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        intakeUsersByUserId: {
          nodes: [{ intakeId: 1 }],
        },
      },
      openIntake: {
        openTimestamp: '2022-08-19T09:00:00-07:00',
        closeTimestamp: '2027-08-19T09:00:00-07:00',
        rollingIntake: false,
      },
      openHiddenIntake: {
        id: '',
      },
    };
  },
};

const mockNoApplicationsPayload = {
  Query() {
    return {
      allApplications: { edges: [] },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: {
        openTimestamp: '2022-08-19T09:00:00-07:00',
        closeTimestamp: '2027-08-19T09:00:00-07:00',
        rollingIntake: false,
      },
      openHiddenIntake: {
        id: '',
      },
    };
  },
};

const mockClosedIntakePayload = {
  Query() {
    return {
      allApplications: { edges: [] },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: null,
      openHiddenIntake: null,
    };
  },
};

const mockClosedIntakeOpenHiddenIntakePayload = {
  Query() {
    return {
      allApplications: { edges: [] },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: null,
      openHiddenIntake: {
        id: 'asdf',
      },
    };
  },
};

const mockInviteOnlyOpenIntakeNoAccessPayload = {
  Query() {
    return {
      allApplications: { edges: [] },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        ccbcUserBySub: {
          intakeUsersByUserId: {
            nodes: [],
          },
        },
      },
      openIntake: {
        rowId: 99,
        openTimestamp: '2022-08-19T09:00:00-07:00',
        closeTimestamp: '2027-08-19T09:00:00-07:00',
        rollingIntake: false,
        ccbcIntakeNumber: 7,
        hidden: false,
        hiddenCode: 'invite-only',
      },
      openHiddenIntake: null,
    };
  },
};

const mockInviteOnlyOpenIntakeWithAccessPayload = {
  Query() {
    return {
      allApplications: { edges: [] },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        ccbcUserBySub: {
          intakeUsersByUserId: {
            nodes: [{ intakeId: 99 }],
          },
        },
      },
      openIntake: {
        rowId: 99,
        openTimestamp: '2022-08-19T09:00:00-07:00',
        closeTimestamp: '2027-08-19T09:00:00-07:00',
        rollingIntake: false,
        ccbcIntakeNumber: 7,
        hidden: false,
        hiddenCode: 'invite-only',
      },
      openHiddenIntake: null,
    };
  },
};

const mockQueryPayloadRollingIntake = {
  Query() {
    return {
      allApplications: {
        edges: [
          {
            node: {
              id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
              rowId: 2,
              owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              status: 'withdrawn',
              projectName: null,
              ccbcNumber: 'CCBC-010001',
              formData: {
                lastEditedPage: '',
                isEditable: false,
                formByFormSchemaId: {
                  jsonSchema: schema,
                },
              },
              intakeByIntakeId: {
                ccbcIntakeNumber: 1,
                closeTimestamp: '2022-09-09T13:49:23.513427-07:00',
                openTimestamp: '2022-07-25T00:00:00-07:00',
              },
            },
          },
        ],
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: {
        openTimestamp: '2022-08-19T09:00:00-07:00',
        closeTimestamp: '2027-08-19T09:00:00-07:00',
        rollingIntake: true,
        ccbcIntakeNumber: 7,
      },
      openHiddenIntake: {
        id: '',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<dashboardQuery>({
  pageComponent: Dashboard,
  compiledQuery: compileddashboardQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    formOwner: { owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6' },
    code: 'asdf',
  },
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/applicantportal/dashboard',
    });
  });

  it('displays the correct nav links when user is logged in', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-btn-test')).toBeInTheDocument();
  });

  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/applicantportal/dashboard',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/applicantportal',
      },
    });
  });

  it('should have disabled create application when hidden intake open but feature flag is off', async () => {
    pageTestingHelper.loadQuery(mockClosedIntakeOpenHiddenIntakePayload);
    pageTestingHelper.renderPage();
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValueOnce(mockInternalIntakeClosed);

    expect(screen.getByText('Create application')).toBeDisabled();
  });

  it('displays the alert message when there is no open intake', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockClosedIntake);
    pageTestingHelper.loadQuery(mockClosedIntakePayload);
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    expect(screen.getByText(closedIntakeMessage)).toBeInTheDocument();
    expect(screen.queryByText(openedIntakeMessage)).toBeNull();
  });

  it('displays the open intake message when there an open intake', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockOpenIntake);
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    expect(screen.getByText(openedIntakeMessage)).toBeInTheDocument();
    expect(screen.queryByText(closedIntakeMessage)).toBeNull();
  });

  it('displays the close intake message when there an open intake', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockSubtractedValue);
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(/August 19, 2027, 8:30:00 a.m. PDT/)
    ).toBeInTheDocument();
  });

  it('has create intake button enabled when there is an open intake', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(`Create application`).closest('button').disabled
    ).toBeFalse();
  });

  it('has create intake button disabled when there is no open intake', async () => {
    pageTestingHelper.loadQuery(mockClosedIntakePayload);
    pageTestingHelper.renderPage();

    expect(screen.getByText(`Create application`)).toBeDisabled();
  });

  it('has create application button enabled when open hidden intake returns a value', async () => {
    pageTestingHelper.loadQuery(mockClosedIntakeOpenHiddenIntakePayload);
    pageTestingHelper.renderPage();
    pageTestingHelper.router.query = { code: 'asdf' };
    const createApplicationButton = screen.getByText('Create application');
    expect(createApplicationButton).toBeEnabled();
    await userEvent.click(createApplicationButton);
    pageTestingHelper.expectMutationToBeCalled('createApplicationMutation', {
      input: {
        code: 'asdf',
      },
    });
  });

  it('has create application button enabled when hidden intake is open and feature flag is on', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValueOnce(mockInternalIntakeOpen)
      .mockReturnValueOnce(mockClosedIntake)
      .mockReturnValueOnce(mockClosedIntake)
      .mockReturnValueOnce(mockSubtractedValue);
    pageTestingHelper.loadQuery(mockClosedIntakeOpenHiddenIntakePayload);
    pageTestingHelper.renderPage();

    expect(screen.getByText('Create application')).toBeEnabled();
  });

  it('shows email button when intake is invite-only and user has no access', async () => {
    pageTestingHelper.loadQuery(mockInviteOnlyOpenIntakeNoAccessPayload);
    pageTestingHelper.renderPage();

    expect(screen.queryByText('Create application')).toBeNull();
    expect(screen.getByText('Email Us')).toBeInTheDocument();
  });

  it('shows create application when intake is invite-only and user has access', async () => {
    pageTestingHelper.loadQuery(mockInviteOnlyOpenIntakeWithAccessPayload);
    pageTestingHelper.renderPage();

    expect(screen.getByText('Create application')).toBeEnabled();
  });

  it('displays the message when user has no applications', async () => {
    pageTestingHelper.loadQuery(mockNoApplicationsPayload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(`Applications will appear here`)
    ).toBeInTheDocument();
  });

  it('displays the dashboard table when the user has an application', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText(`CCBC ID`)).toBeInTheDocument();
    expect(screen.getByText(`Intake`)).toBeInTheDocument();
    expect(screen.getByText(`Project title`)).toBeInTheDocument();
    expect(screen.getByText(`Status`)).toBeInTheDocument();
    expect(screen.getByText(`Actions`)).toBeInTheDocument();
    expect(screen.getByText(`CCBC-010001`)).toBeInTheDocument();
    expect(screen.getByText(`Withdrawn`)).toBeInTheDocument();
    expect(screen.getAllByText(`View`)[0]).toBeInTheDocument();
  });

  it('displays the intake numbers for 3 applications', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should show the delete button for draft applications', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should show correct message for intake submission', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        /You can edit draft and submitted applications until this date/
      )
    ).toBeInTheDocument();
  });

  it('should show correct message for intake submission when rolling intake', async () => {
    pageTestingHelper.loadQuery(mockQueryPayloadRollingIntake);
    pageTestingHelper.renderPage();

    expect(
      screen.queryByText(
        /You can edit draft and submitted applications until this date/
      )
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /Intake 7 is now open until August 19, 2027, 8:30:00 a.m. PDT. If you are interested in submitting an application, or for any questions about connectivity projects in your area, please email/
      )
    ).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
