import { fireEvent, screen } from '@testing-library/react';
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
            total: 15,
            countType: 'new',
            ccbcNumbers: 'CCBC-010001',
          },
          {
            total: 30,
            countType: 'updated',
            ccbcNumbers: 'CCBC-010002',
          },
          {
            total: 6,
            countType: 'unmatched',
            ccbcNumbers: 'CCBC-010003',
          },
          {
            total: 5,
            countType: 'unchanged',
            ccbcNumbers: 'CCBC-010004',
          },
          {
            total: 56,
            countType: 'total',
            ccbcNumbers: 'CCBC-010005',
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

  it('displays the added message with the correct number of projects', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText('GIS analysis added to 15 projects for the first time')
    ).toBeVisible();
  });

  it('displays the updated message with the correct number of projects', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText('GIS analysis updated for 30 projects')
    ).toBeVisible();
  });

  it('displays the unchanged message with the correct number of projects', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        'GIS analysis unchanged for 5 projects and was not updated'
      )
    ).toBeVisible();
  });

  it('displays the unmatched message with the correct number of projects', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        'GIS analysis found for 6 CCBC numbers that are not in the portal'
      )
    ).toBeVisible();
  });

  it('displays the total message with the correct number', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Total processed 56')).toBeVisible();
  });

  it('displays the correct label and ccbc numbers on added toggle', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const toggleButton = screen.getAllByTestId('toggle-button')[0];

    fireEvent.click(toggleButton);

    expect(screen.getByText('Hide Projects')).toBeVisible();
    expect(screen.getByText('CCBC-010001')).toBeVisible();
  });

  it('renders the return to dashboard button', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const button = screen.getByRole('button', { name: 'Return to dashboard' });
    expect(button).toBeVisible();
    expect(button.parentElement).toHaveAttribute('href', '/analyst/dashboard');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
