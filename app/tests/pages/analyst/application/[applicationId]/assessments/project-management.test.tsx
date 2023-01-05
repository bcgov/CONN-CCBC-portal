import { screen } from '@testing-library/react';
import PmAssessment from 'pages/analyst/application/[applicationId]/assessments/project-management';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledProjectManagementAssessmentQuery, {
  projectManagementAssessmentQuery,
} from '__generated__/projectManagementAssessmentQuery.graphql';

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

const pageTestingHelper =
  new PageTestingHelper<projectManagementAssessmentQuery>({
    pageComponent: PmAssessment,
    compiledQuery: compiledProjectManagementAssessmentQuery,
    defaultQueryResolver: mockQueryPayload,
    defaultQueryVariables: {
      rowId: 1,
    },
  });

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      asPath: '/analyst/application/1/assessments/project-management',
      query: { applicationId: '1' },
    });
  });

  it('highlights the correct nav tab', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tab = screen.getByRole('link', { name: 'Project Management' });

    expect(tab).toBeVisible();
    expect(tab).toHaveStyle('font-weight: 700;');
  });

  it('shows the other tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const technical = screen.getByRole('link', { name: 'Technical' });
    const screening = screen.getByRole('link', { name: 'Screening' });
    const financialRisk = screen.getByRole('link', {
      name: 'Financial Risk',
    });

    expect(technical).toBeVisible();
    expect(screening).toBeVisible();
    expect(financialRisk).toBeVisible();

    expect(technical).toHaveStyle('font-weight: 400;');
    expect(screening).toHaveStyle('font-weight: 400;');
    expect(financialRisk).toHaveStyle('font-weight: 400;');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
