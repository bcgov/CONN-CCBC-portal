import { screen } from '@testing-library/react';
import * as moduleApi from '@growthbook/growthbook-react';
import { FeatureResult, JSONValue } from '@growthbook/growthbook-react';
import compiledPagesQuery, {
  applicantportalQuery,
} from '__generated__/applicantportalQuery.graphql';
import Home, { withRelayOptions } from '../../../pages/applicantportal';
import PageTestingHelper from '../../utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: {
        openTimestamp: '2022-08-19T09:00:00-07:00',
        closeTimestamp: '2027-08-19T09:00:00-07:00',
        rollingIntake: false,
        ccbcIntakeNumber: 7,
      },
    };
  },
};

const mockClosedIntakePayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: null,
    };
  },
};

const loggedOutPayload = {
  Query() {
    return {
      session: {
        sub: null,
      },
      openIntake: null,
    };
  },
};

const mockQueryPayloadRollingIntake = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: {
        ccbcIntakeNumber: 7,
        openTimestamp: '2022-08-19T09:00:00-07:00',
        closeTimestamp: '2027-08-19T09:00:00-07:00',
        rollingIntake: true,
      },
    };
  },
};

const openedIntakeMessage =
  'New applications will be accepted after updates to ISED‘s Eligibility Mapping tool are released.';
const closedIntakeMessage = 'Intake is closed.';

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
  ruleId: 'closed_intake_alert',
};

const mockSubtractedValue: FeatureResult<JSONValue> = {
  value: 30,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_subtracted_time',
};

const pageTestingHelper = new PageTestingHelper<applicantportalQuery>({
  pageComponent: Home,
  compiledQuery: compiledPagesQuery,
  defaultQueryResolver: mockQueryPayload,
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
  });

  it('does not redirect an unauthorized user', async () => {
    expect(
      await withRelayOptions.serverSideProps({
        pathname: '',
        query: undefined,
        AppTree: undefined,
      })
    ).toEqual({});
  });

  it('Displays the Go to dashboard button for a logged in user', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Go to dashboard')).toBeInTheDocument();
  });

  it('Displays the alert message when there is no open intake', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockClosedIntake);
    pageTestingHelper.loadQuery(mockClosedIntakePayload);
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    expect(screen.getByText(closedIntakeMessage)).toBeInTheDocument();
    expect(screen.queryByText(openedIntakeMessage)).toBeNull();
  });

  it('Displays the alert message when there is an open intake', () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockOpenIntake);
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    expect(screen.getByText(openedIntakeMessage)).toBeInTheDocument();
    expect(screen.queryByText(closedIntakeMessage)).toBeNull();
  });

  it('Displays the callout message with correct time when there is an open intake', () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockSubtractedValue);
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        /Intake 7 is now open until August 19, 2027, 8:30:00 a.m. PDT. If you are interested in submitting an application, or for any questions about connectivity projects in your area, please email/
      )
    ).toBeInTheDocument();
    // expect(
    //   screen.getByText(
    //     /Draft and submitted applications will be editable until then./
    //   )
    // ).toBeInTheDocument();
  });

  it('Displays the callout message with correct information about submission', () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockSubtractedValue);
    pageTestingHelper.loadQuery(mockQueryPayloadRollingIntake);
    pageTestingHelper.renderPage();

    expect(
      screen.queryByText(
        /Draft and submitted applications will be editable until then./
      )
    ).not.toBeInTheDocument();
  });

  it('Displays the Business BCeID login button', () => {
    pageTestingHelper.loadQuery(loggedOutPayload);
    pageTestingHelper.renderPage();
    const button = screen.getByRole('button', {
      name: 'Login with Business BCeID',
    });
    expect(button.closest('form')).toHaveAttribute(
      'action',
      '/api/login/kc_idp_hint=bceidbusiness'
    );
  });

  it('Displays the Basic BCeID login button', () => {
    pageTestingHelper.loadQuery(loggedOutPayload);
    pageTestingHelper.renderPage();
    const button = screen.getByRole('button', {
      name: 'Login with Basic BCeID',
    });
    expect(button.closest('form')).toHaveAttribute(
      'action',
      '/api/login/kc_idp_hint=bceidbasic'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
