import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScreeningAssessment from 'pages/analyst/application/[applicationId]/assessments/screening';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledScreeningAssessmentsQuery, {
  screeningAssessmentQuery,
} from '__generated__/screeningAssessmentQuery.graphql';
import { CCBC_ELIGIBILITY_SCREENING_TEMPLATE } from 'data/externalConstants';
import sharedAssessmentTests from './shared-assessments';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      applicationByRowId: {
        rowId: 1,
        assessmentForm: null,
        status: 'received',
      },
      allApplicationStatusTypes: {
        ...allApplicationStatusTypes,
      },
      allAnalysts: {
        nodes: [
          {
            rowId: 1,
            givenName: 'Test',
            familyName: '1',
          },
          {
            rowId: 2,
            givenName: 'Test',
            familyName: '2',
          },
        ],
      },
    };
  },
};

const mockQueryPayloadWithFormData = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      applicationByRowId: {
        rowId: 1,
        assessmentForm: {
          jsonData: {
            assignedTo: 'Test 3',
            decision: 'No decision',
            nextStep: 'Not started',
          },
        },
        status: 'received',
      },
      allApplicationStatusTypes: {
        ...allApplicationStatusTypes,
      },
      allAnalysts: {
        nodes: [
          {
            rowId: 1,
            givenName: 'Test',
            familyName: '1',
          },
          {
            rowId: 2,
            givenName: 'Test',
            familyName: '2',
          },
        ],
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<screeningAssessmentQuery>({
  pageComponent: ScreeningAssessment,
  compiledQuery: compiledScreeningAssessmentsQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      asPath: '/analyst/application/1/assessments/screening',
      query: { applicationId: '1' },
    });
  });

  it('highlights the correct nav tab', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tab = screen.getByRole('link', { name: 'Screening' });

    expect(tab).toBeVisible();
    expect(tab).toHaveStyle('font-weight: 700;');
  });

  it('shows the other tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const technical = screen.getByRole('link', { name: 'Technical' });
    const financialRisk = screen.getByRole('link', { name: 'Financial Risk' });
    const projectManagement = screen.getByRole('link', {
      name: 'Project Management',
    });

    expect(technical).toBeVisible();
    expect(financialRisk).toBeVisible();
    expect(projectManagement).toBeVisible();

    expect(technical).toHaveStyle('font-weight: 400;');
    expect(financialRisk).toHaveStyle('font-weight: 400;');
    expect(projectManagement).toHaveStyle('font-weight: 400;');
  });

  it('displays the template link', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const linkElement = screen.getByRole('link', {
      name: /CCBC_Eligibility Screening Template/,
    });

    expect(linkElement).toBeVisible();
    expect(linkElement).toHaveAttribute(
      'href',
      CCBC_ELIGIBILITY_SCREENING_TEMPLATE
    );
  });

  it('Displays the form', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByLabelText('Needs 2nd review')).toBeInTheDocument();
    expect(screen.getByLabelText('Eligible')).toBeInTheDocument();
    expect(
      screen.getByText('Applicant is contesting the area map')
    ).toBeInTheDocument();
  });

  it('Form saves when submit button is pressed', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    await userEvent.click(screen.getByLabelText('Eligible'));

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    pageTestingHelper.expectMutationToBeCalled('createAssessmentMutation', {
      input: {
        _applicationId: 1,
        _jsonData: {
          nextStep: 'Not started',
          decision: 'Eligible',
          contestingMap: [],
        },
        _assessmentType: 'screening',
      },
      connections: [],
    });
  });

  it('Trigger email when notify by email button clicked', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn() });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const notifyByEmailButton = screen.getByRole('button', {
      name: 'Notify by email',
    });

    expect(notifyByEmailButton).toBeDisabled();

    await userEvent.click(screen.getByLabelText('Needs 2nd review'));

    expect(notifyByEmailButton).toBeEnabled();

    await userEvent.click(notifyByEmailButton);

    pageTestingHelper.expectMutationToBeCalled('createAssessmentMutation', {
      input: {
        _applicationId: 1,
        _jsonData: {
          nextStep: 'Needs 2nd review',
          decision: 'No decision',
          contestingMap: [],
        },
        _assessmentType: 'screening',
      },
      connections: [],
    });

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAssessmentForm: {
            assessmentData: {
              id: 'WyJhc3Nlc3NtZW50X2RhdGEiLDIxXQ==',
              rowId: 1,
              jsonData: {
                nextStep: 'Needs 2nd review',
                decision: 'No decision',
                contestingMap: [],
              },
            },
          },
        },
      });
    });

    expect(global.fetch).toHaveBeenCalled();

    expect(
      screen.getByText('Email notification sent successfully')
    ).toBeVisible();

    expect(notifyByEmailButton).toBeDisabled();
  });

  it('shows a toast when email notification fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: jest.fn() });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const notifyByEmailButton = screen.getByRole('button', {
      name: 'Notify by email',
    });

    expect(notifyByEmailButton).toBeDisabled();

    await userEvent.click(screen.getByLabelText('Needs 2nd review'));

    expect(notifyByEmailButton).toBeEnabled();

    await userEvent.click(notifyByEmailButton);

    pageTestingHelper.expectMutationToBeCalled('createAssessmentMutation', {
      input: {
        _applicationId: 1,
        _jsonData: {
          nextStep: 'Needs 2nd review',
          decision: 'No decision',
          contestingMap: [],
        },
        _assessmentType: 'screening',
      },
      connections: [],
    });

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAssessmentForm: {
            assessmentData: {
              id: 'WyJhc3Nlc3NtZW50X2RhdGEiLDIxXQ==',
              rowId: 1,
              jsonData: {
                nextStep: 'Needs 2nd review',
                decision: 'No decision',
                contestingMap: [],
              },
            },
          },
        },
      });
    });

    expect(global.fetch).toHaveBeenCalled();

    expect(
      screen.getByText('Email notification did not work, please try again')
    ).toBeVisible();

    expect(notifyByEmailButton).toBeEnabled();
  });

  it('Displays unavailable Assigned To value for lead', () => {
    pageTestingHelper.loadQuery(mockQueryPayloadWithFormData);
    pageTestingHelper.renderPage();

    expect(screen.getByLabelText('Assigned to')).toHaveTextContent('Test 3');
  });

  sharedAssessmentTests(pageTestingHelper);

  afterEach(() => {
    jest.clearAllMocks();
  });
});
