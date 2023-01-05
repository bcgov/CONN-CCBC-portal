import { screen } from '@testing-library/react';
import TechnicalAssessment from 'pages/analyst/application/[applicationId]/assessments/technical';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledTechnicalAssessmentQuery, {
  technicalAssessmentQuery,
} from '__generated__/technicalAssessmentQuery.graphql';

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

const pageTestingHelper = new PageTestingHelper<technicalAssessmentQuery>({
  pageComponent: TechnicalAssessment,
  compiledQuery: compiledTechnicalAssessmentQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      asPath: '/analyst/application/1/assessments/technical',
      query: { applicationId: '1' },
    });
  });

  it('highlights the correct nav tab', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tab = screen.getByRole('link', { name: 'Technical' });

    expect(tab).toBeVisible();
    expect(tab).toHaveStyle('font-weight: 700;');
  });

  it('shows the other tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const projectManagement = screen.getByRole('link', {
      name: 'Project Management',
    });
    const screening = screen.getByRole('link', { name: 'Screening' });
    const financialRisk = screen.getByRole('link', {
      name: 'Financial Risk',
    });

    expect(projectManagement).toBeVisible();
    expect(screening).toBeVisible();
    expect(financialRisk).toBeVisible();

    expect(projectManagement).toHaveStyle('font-weight: 400;');
    expect(screening).toHaveStyle('font-weight: 400;');
    expect(financialRisk).toHaveStyle('font-weight: 400;');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
