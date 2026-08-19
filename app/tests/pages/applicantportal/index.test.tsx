import { screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { JSONValue } from 'lib/helpers/useDeferredFeature';
import { useFeatureFlagMap } from 'components/FeatureFlagProvider';
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

const mockOpenIntakeData: JSONValue = {
  variant: 'warning',
  text: openedIntakeMessage,
  displayOpenDate: false,
};

// Business rule: the displayed close time is shown 30 minutes earlier than
// the actual close timestamp.
const mockSubtractedTimeValue = 30;

const pageTestingHelper = new PageTestingHelper<applicantportalQuery>({
  pageComponent: Home,
  compiledQuery: compiledPagesQuery,
  defaultQueryResolver: mockQueryPayload,
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    // Reset to no flags configured so each test starts from a clean slate
    // and individual tests can opt in to the flag values they need.
    mocked(useFeatureFlagMap).mockReturnValue({});
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

  it('Displays the alert message when there is an open intake', () => {
    mocked(useFeatureFlagMap).mockReturnValue({
      open_intake_alert: { isEnabled: true, value: mockOpenIntakeData },
    });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    expect(screen.getByText(openedIntakeMessage)).toBeInTheDocument();
  });

  it('Displays the callout message with correct time when there is an open intake', () => {
    mocked(useFeatureFlagMap).mockReturnValue({
      show_subtracted_time: { isEnabled: true, value: mockSubtractedTimeValue },
    });
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
    mocked(useFeatureFlagMap).mockReturnValue({
      show_subtracted_time: { isEnabled: true, value: mockSubtractedTimeValue },
    });
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
