import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FinancialRiskAssessment from 'pages/analyst/application/[applicationId]/assessments/financial-risk';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledFinancialRiskAssessmentQuery, {
  financialRiskAssessmentQuery,
} from '__generated__/financialRiskAssessmentQuery.graphql';
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

const pageTestingHelper = new PageTestingHelper<financialRiskAssessmentQuery>({
  pageComponent: FinancialRiskAssessment,
  compiledQuery: compiledFinancialRiskAssessmentQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      asPath: '/analyst/application/1/assessments/financial-risk',
      query: { applicationId: '1' },
    });
  });

  it('highlights the correct nav tab', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tab = screen.getByRole('link', { name: 'Financial Risk' });

    expect(tab).toBeVisible();
    expect(tab).toHaveStyle('font-weight: 700;');
  });

  it('shows the other tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const technical = screen.getByRole('link', { name: 'Technical' });
    const screening = screen.getByRole('link', { name: 'Screening' });
    const projectManagement = screen.getByRole('link', {
      name: 'Project Management',
    });

    expect(technical).toBeVisible();
    expect(screening).toBeVisible();
    expect(projectManagement).toBeVisible();

    expect(technical).toHaveStyle('font-weight: 400;');
    expect(screening).toHaveStyle('font-weight: 400;');
    expect(projectManagement).toHaveStyle('font-weight: 400;');
  });

  it('Form saves when submit button is pressed', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    await userEvent.click(screen.getByLabelText('Low risk'));

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    pageTestingHelper.expectMutationToBeCalled('createAssessmentMutation', {
      input: {
        _applicationId: 1,
        _jsonData: {
          nextStep: 'Not started',
          decision: 'Low risk',
        },
        _dependenciesData: null,
        _assessmentType: 'financialRisk',
      },
      connections: [],
    });
  });

  sharedAssessmentTests(pageTestingHelper);

  afterEach(() => {
    jest.clearAllMocks();
  });
});
