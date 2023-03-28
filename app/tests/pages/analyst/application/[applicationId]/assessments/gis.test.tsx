import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GISAssessment from 'pages/analyst/application/[applicationId]/assessments/gis';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledGisAssessmentsQuery, {
  gisAssessmentQuery,
} from '__generated__/gisAssessmentQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      applicationByRowId: {
        rowId: 1,
        assessmentForm: {
          jsonData: {},
          createdAt: '2023-03-27T12:44:09.882871-07:00',
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

const pageTestingHelper = new PageTestingHelper<gisAssessmentQuery>({
  pageComponent: GISAssessment,
  compiledQuery: compiledGisAssessmentsQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      asPath: '/analyst/application/1/assessments/gis',
      query: { applicationId: '1' },
    });
  });

  it('highlights the correct nav tab', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tab = screen.getByRole('link', { name: 'GIS' });

    expect(tab).toBeVisible();
    expect(tab).toHaveStyle('font-weight: 700;');
  });

  it('Displays the form', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByLabelText('Assigned to')).toBeInTheDocument();
    expect(screen.getByLabelText('Target date')).toBeInTheDocument();
    expect(screen.getByText('Not started')).toBeInTheDocument();
    expect(screen.getByText('Needs RFI')).toBeInTheDocument();
    expect(screen.getByText('Needs 2nd review')).toBeInTheDocument();
    expect(
      screen.getByText('No obvious flags identified at this stage')
    ).toBeInTheDocument();
  });

  it('fills the form and calls the create assessment mutation when saved', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const commentsOnCoverageData = screen.getByTestId(
      'root_commentsOnCoverageData'
    );
    const commentsOnHouseholdCounts = screen.getByTestId(
      'root_commentsOnHouseholdCounts'
    );
    const commentsOnOverbuild = screen.getByTestId('root_commentsOnOverbuild');
    const commentsOnOverlap = screen.getByTestId('root_commentsOnOverlap');

    await act(async () => {
      fireEvent.change(commentsOnCoverageData, {
        target: { value: 'test 1' },
      });
      fireEvent.change(commentsOnHouseholdCounts, {
        target: { value: 'test 2' },
      });
      fireEvent.change(commentsOnOverbuild, {
        target: { value: 'test 3' },
      });
      fireEvent.change(commentsOnOverlap, {
        target: { value: 'test 4' },
      });
    });

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    pageTestingHelper.expectMutationToBeCalled('createAssessmentMutation', {
      input: {
        _applicationId: 1,
        _jsonData: {
          nextStep: 'Not started',
          commentsOnCoverageData: 'test 1',
          commentsOnHouseholdCounts: 'test 2',
          commentsOnOverbuild: 'test 3',
          commentsOnOverlap: 'test 4',
        },
        _assessmentType: 'gis',
      },
    });
  });

  it('Displays the last updated datetime', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('last-updated')).toHaveTextContent(
      'Last updated: Mar 27, 2023, 12:44 p.m.'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
