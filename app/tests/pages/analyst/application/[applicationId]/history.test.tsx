import { screen } from '@testing-library/react';
import History from 'pages/analyst/application/[applicationId]/history';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledhistoryQuery, {
  historyQuery,
} from '__generated__/historyQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<historyQuery>({
  pageComponent: History,
  compiledQuery: compiledhistoryQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
  });

  it('displays the title', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText(`History placeholder`)).toBeVisible();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
