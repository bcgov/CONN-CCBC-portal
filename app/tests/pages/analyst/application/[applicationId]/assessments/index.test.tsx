import { screen } from '@testing-library/react';
import Assessments from 'pages/analyst/application/[applicationId]/assessments';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledAssessmentsQuery, {
  assessmentsQuery,
} from '__generated__/assessmentsQuery.graphql';
import { CCBC_ASSESSMENT_RFI_INSTRUCTIONS } from 'data/externalConstants';

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
        allAssessments: {
          nodes: [
            {
              jsonData: {
                decision: 'Incomplete',
                nextStep: 'Needs RFI',
                assignedTo: 'Rachel Greenspan',
                targetDate: '2023-01-10',
              },
              assessmentDataType: 'screening',
            },
          ],
        },
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
        ],
      },
    };
  },
};

const customAssessmentQueryPayload = (assessment) => {
  return {
    Query() {
      return {
        ...mockQueryPayload,
        applicationByRowId: {
          ...mockQueryPayload.Query().applicationByRowId,
          allAssessments: {
            nodes: [assessment],
          },
        },
      };
    },
  };
};

const pageTestingHelper = new PageTestingHelper<assessmentsQuery>({
  pageComponent: Assessments,
  compiledQuery: compiledAssessmentsQuery,
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
  });

  it('displays the title', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByRole('heading', { name: 'Assessments' })).toBeVisible();
  });

  it('displays the guide', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const linkElement = screen.getByRole('link', { name: /Guide/ });

    expect(linkElement).toBeVisible();
    expect(linkElement).toHaveAttribute(
      'href',
      CCBC_ASSESSMENT_RFI_INSTRUCTIONS
    );
  });

  it('displays the table headers', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByText('Assessment')[1]).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Analyst')).toBeInTheDocument();
    expect(screen.getByText('Target Date')).toBeInTheDocument();
    expect(screen.getByText('Decision')).toBeInTheDocument();
  });

  it('displays the screening assessment values', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByText('Screening')[1]).toBeInTheDocument();
    expect(screen.getByText('Rachel Greenspan')).toBeInTheDocument();
    expect(screen.getByText('Jan 10, 2023')).toBeInTheDocument();
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
    expect(screen.getAllByText('Not started')[0]).toBeInTheDocument();
  });

  it('should have the correct pill styles', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusDecision = screen.getByText('Incomplete');

    expect(statusDecision).toHaveStyle('color: #FFFFFF');
    expect(statusDecision).toHaveStyle('background-color: #C38A00;');
  });

  it('should have Assigned status if an assessment is assigned with no progress made', async () => {
    const mockPayload = customAssessmentQueryPayload({
      jsonData: {
        assignedTo: 'Rachel Greenspan',
      },
      assessmentDataType: 'screening',
    });

    pageTestingHelper.loadQuery(mockPayload);
    pageTestingHelper.renderPage();

    const statusDecision = screen.getByText('Assigned');
    expect(statusDecision).toHaveStyle('color: #313132;');
    expect(statusDecision).toHaveStyle('background-color: #DBE6F0;');
  });

  it('should not display Assesment Complete if progress is not assessment complete and a decision has been made', async () => {
    const mockPayload = customAssessmentQueryPayload({
      jsonData: {
        decision: 'Incomplete',
        nextStep: 'Needs RFI',
      },
      assessmentDataType: 'screening',
    });

    pageTestingHelper.loadQuery(mockPayload);
    pageTestingHelper.renderPage();

    expect(screen.queryByText('Complete')).not.toBeInTheDocument();
  });

  it('shows assessment complete if decision array is empty', async () => {
    const mockPayload = customAssessmentQueryPayload({
      jsonData: {
        nextStep: 'Assessment complete',
        decision: [],
      },
      assessmentDataType: 'permitting',
    });

    pageTestingHelper.loadQuery(mockPayload);
    pageTestingHelper.renderPage();

    const status = screen.getByText('Assessment complete');

    expect(status).toHaveStyle('color: #FFFFFF');
    expect(status).toHaveStyle('background-color: #2E8540;');
  });

  it('should have the Assessment complete status if progress is Assessment complete and a decision has been made', async () => {
    const mockPayload = customAssessmentQueryPayload({
      jsonData: {
        decision: 'Incomplete',
        nextStep: 'Assessment complete',
      },
      assessmentDataType: 'screening',
    });

    pageTestingHelper.loadQuery(mockPayload);
    pageTestingHelper.renderPage();

    const status = screen.getByText('Assessment complete');

    expect(status).toHaveStyle('color: #FFFFFF');
    expect(status).toHaveStyle('background-color: #2E8540;');
  });

  it('can display multiple status pills for permitting assessment', async () => {
    const mockPayload = customAssessmentQueryPayload({
      jsonData: {
        decision: [
          'Major permit approval issues anticipated. Likely to influence timeline.',
          'Minor permit approval issues anticipated. Could influence timeline.',
          'Normal permitting requirements and timelines anticipated.',
        ],
      },
      assessmentDataType: 'permitting',
    });

    pageTestingHelper.loadQuery(mockPayload);
    pageTestingHelper.renderPage();

    const status1 = screen.getByText('Delays anticipated');
    const status2 = screen.getByText('No obvious flags');
    const status3 = screen.getByText('Major issues');

    expect(status1).toHaveStyle('color: #FFFFFF');
    expect(status1).toHaveStyle('background-color: #C38A00;');

    expect(status2).toHaveStyle('color: #FFFFFF');
    expect(status2).toHaveStyle('background-color: #2E8540;');

    expect(status3).toHaveStyle('color: #FFFFFF');
    expect(status3).toHaveStyle('background-color: #D8292F;');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
