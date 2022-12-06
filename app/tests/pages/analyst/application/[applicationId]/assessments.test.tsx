import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Assessments from 'pages/analyst/application/[applicationId]/assessments';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledassessmentsQuery, {
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

const pageTestingHelper = new PageTestingHelper<assessmentsQuery>({
  pageComponent: Assessments,
  compiledQuery: compiledassessmentsQuery,
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

    expect(screen.getByText(`Screening`)).toBeVisible();
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

    pageTestingHelper.expectMutationToBeCalled(
      'createScreeningAssessmentMutation',
      {
        input: {
          _applicationId: 1,
          _jsonData: {
            decision: 'Eligible',
          },
          schemaSlug: 'screeningAssessmentSchema',
        },
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
