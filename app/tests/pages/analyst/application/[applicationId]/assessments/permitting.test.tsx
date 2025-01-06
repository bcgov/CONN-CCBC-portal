import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PermittingAssessment from 'pages/analyst/application/[applicationId]/assessments/permitting';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledPermittingAssessmentsQuery, {
  permittingAssessmentQuery,
} from '__generated__/permittingAssessmentQuery.graphql';

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

const pageTestingHelper = new PageTestingHelper<permittingAssessmentQuery>({
  pageComponent: PermittingAssessment,
  compiledQuery: compiledPermittingAssessmentsQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      asPath: '/analyst/application/1/assessments/permitting',
      query: { applicationId: '1' },
    });
  });

  it('highlights the correct nav tab', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tab = screen.getByRole('link', { name: 'Permitting' });

    expect(tab).toBeVisible();
    expect(tab).toHaveStyle('font-weight: 700;');
  });

  it('Displays the form', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByLabelText('Assigned to')).toBeInTheDocument();
    expect(screen.getByLabelText('Target date')).toBeInTheDocument();
    expect(screen.getByText('Flags')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Major permit approval issues anticipated. Likely to influence timeline.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Minor permit approval issues anticipated. Could influence timeline.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Normal permitting requirements and timelines anticipated.'
      )
    ).toBeInTheDocument();
  });

  it('Form saves when submit button is pressed', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const checkBoxes = screen.getAllByRole('checkbox');

    const lastCheckBox = checkBoxes.pop();

    await userEvent.click(lastCheckBox);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    pageTestingHelper.expectMutationToBeCalled('createAssessmentMutation', {
      input: {
        _applicationId: 1,
        _jsonData: {
          nextStep: 'Not started',
          decision: [
            'Normal permitting requirements and timelines anticipated.',
          ],
        },
        _dependenciesData: null,
        _assessmentType: 'permitting',
      },
      connections: [],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
