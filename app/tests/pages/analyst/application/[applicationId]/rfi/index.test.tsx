import { screen } from '@testing-library/react';
import RFI from 'pages/analyst/application/[applicationId]/rfi';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledhistoryQuery, {
  historyQuery,
} from '__generated__/historyQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        ccbcNumber: 'CCBC-10001',
        organizationName: 'test org',
        projectName: 'test project',
        formData: {
          jsonData: {},
          formByFormSchemaId: {
            jsonSchema: {},
          },
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
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

const pageTestingHelper = new PageTestingHelper<historyQuery>({
  pageComponent: RFI,
  compiledQuery: compiledhistoryQuery,
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

    expect(screen.getByRole('heading', { name: 'RFI' })).toBeInTheDocument();
  });

  it('displays the New RFI button', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('button', {
        name: 'New RFI',
      })
    ).toBeVisible();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
