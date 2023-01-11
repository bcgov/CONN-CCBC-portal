import { screen } from '@testing-library/react';
import Assessments from 'pages/analyst/application/[applicationId]/assessments';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledAssessmentsQuery, {
  assessmentsQuery,
} from '__generated__/assessmentsQuery.graphql';

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
                nextStep: 'Assessment complete',
                assignedTo: 'Rachel Greenspan',
                targetDate: '2023-01-10',
              },
              assessmentDataType: 'screening',
            },
            {
              jsonData: {
                assignedTo: 'Harpreet Bains',
              },
              assessmentDataType: 'technical',
            },
            {
              assessmentDataType: 'projectManagement',
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
    expect(screen.getAllByText('Complete')[1]).toBeInTheDocument();
    expect(screen.getByText('Rachel Greenspan')).toBeInTheDocument();
    expect(screen.getByText('Tue, Jan 10')).toBeInTheDocument();
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
    expect(screen.getAllByText('Not started')[0]).toBeInTheDocument();
  });

  it('should have the correct pill styles', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusProgress = screen.getAllByText('Complete')[1];
    const statusDecision = screen.getByText('Incomplete');

    expect(statusProgress).toHaveStyle('color: #FFFFFF');
    expect(statusProgress).toHaveStyle('background-color: #345FA9;');
    expect(statusDecision).toHaveStyle('color: #FFFFFF');
    expect(statusDecision).toHaveStyle('background-color: #C38A00;');
  });

  it('should have the correct status if an assessment is assigned with no decision', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusDecision = screen.getByText('Assigned');
    expect(statusDecision).toHaveStyle('color: #313132;');
    expect(statusDecision).toHaveStyle('background-color: #DBE6F0;');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
