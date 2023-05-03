import { screen } from '@testing-library/react';
import getGisUploadSuccessQuery, {
  BatchIdQuery,
} from '__generated__/BatchIdQuery.graphql';
import Success from 'pages/analyst/gis/[batchId]/success';
import PageTestingHelper from 'tests/utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
      gisDataCounts: {
        nodes: [
          {
            total: 25,
            countType: 'type1',
            ccbcNumbers: 'CCBC-010001',
          },
          {
            total: 30,
            countType: 'type2',
            ccbcNumbers: 'CCBC-010002',
          },
          {
            total: 55,
            countType: 'type3',
            ccbcNumbers: 'CCBC-010003',
          },
        ],
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_admin',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<BatchIdQuery>({
  pageComponent: Success,
  compiledQuery: getGisUploadSuccessQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: { batchId: 1 },
});

describe('BatchIdPage', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/success-gis-upload',
      query: { batchId: '1' },
    });
  });

  it('displays the success message with the correct number of projects', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText('GIS information successfully added to 55 projects')
    ).toBeVisible();
  });

  it('renders the return to dashboard button', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const button = screen.getByRole('button', { name: 'Return to dashboard' });
    expect(button).toBeVisible();
    expect(button).toHaveAttribute('href', '/analyst/dashboard');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
