import { screen } from '@testing-library/react';
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
  });

  it('displays the title', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText(`Assessments placeholder`)).toBeVisible();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
