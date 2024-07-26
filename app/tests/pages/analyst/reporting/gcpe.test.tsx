import { act, fireEvent, screen } from '@testing-library/react';
import GcpeReporting from 'pages/analyst/reporting/gcpe';

import compiledGcpeReportingQuery, {
  gcpeReportingQuery,
} from '__generated__/gcpeReportingQuery.graphql';
import PageTestingHelper from '../../../utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'cbc_admin',
      },
      allReportingGcpes: {
        edges: [
          {
            node: {
              rowId: 1,
              createdAt: '2024-06-28T20:05:52.383864+00:00',
            },
          },
          {
            node: {
              rowId: 2,
              createdAt: '2024-06-27T01:50:51.270249+00:00',
            },
          },
          {
            node: {
              rowId: 3,
              createdAt: '2024-06-26T01:51:05.63794+00:00',
            },
          },
          {
            node: {
              rowId: 4,
              createdAt: '2024-06-25T01:53:22.963979+00:00',
            },
          },
          {
            node: {
              rowId: 5,
              createdAt: '2024-06-24T01:55:04.948302+00:00',
            },
          },
        ],
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () =>
      Promise.resolve(
        new Blob(['test content'], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      ),
    headers: {
      get: (header) => {
        const headers = {
          rowId: '1',
        };
        return headers[header];
      },
    },
  })
) as jest.Mock;

// Mock the window.URL functions
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

const pageTestingHelper = new PageTestingHelper<gcpeReportingQuery>({
  pageComponent: GcpeReporting,
  compiledQuery: compiledGcpeReportingQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The Gcpe reporting page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/reporting/gcpe',
    });
  });

  it('highlights the correct nav tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tabName = 'GCPE';

    expect(
      screen.getByRole('link', {
        name: tabName,
      })
    ).toBeVisible();
  });

  it('renders correct headings', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Generate a new report')).toBeInTheDocument();
    expect(screen.getByText('Download an existing report')).toBeInTheDocument();
    expect(screen.getByText('Generate and compare')).toBeInTheDocument();
    expect(screen.getAllByText('Compare')[1]).toBeInTheDocument();
  });

  it('generates a report', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const generateButton = screen.getByRole('button', {
      name: 'Generate',
    });

    await act(async () => {
      fireEvent.click(generateButton);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('downloads an existing report', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const select = screen.getByTestId('reportToDownload');

    await act(async () => {
      fireEvent.change(select, { target: { value: '3' } });
    });

    const downloadButton = screen.getByRole('button', {
      name: 'Download',
    });

    await act(async () => {
      fireEvent.click(downloadButton);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('generates and compare a report', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const select = screen.getByTestId('reportToCompare');

    await act(async () => {
      fireEvent.change(select, { target: { value: '3' } });
    });

    const downloadButton = screen.getByRole('button', {
      name: 'Generate & Compare',
    });

    await act(async () => {
      fireEvent.click(downloadButton);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('compares two reports', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const selectSource = screen.getByTestId('reportSource');

    await act(async () => {
      fireEvent.change(selectSource, { target: { value: '3' } });
    });

    const selectTarget = screen.getByTestId('reportTarget');

    await act(async () => {
      fireEvent.change(selectTarget, { target: { value: '4' } });
    });

    const downloadButton = screen.getByRole('button', {
      name: 'Compare',
    });

    await act(async () => {
      fireEvent.click(downloadButton);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles fetch failure', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    // Mocking global.fetch to return a rejected promise
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Fetch failed'))
    ) as jest.Mock;

    const selectSource = screen.getByTestId('reportSource');

    await act(async () => {
      fireEvent.change(selectSource, { target: { value: '3' } });
    });

    const selectTarget = screen.getByTestId('reportTarget');

    await act(async () => {
      fireEvent.change(selectTarget, { target: { value: '4' } });
    });

    const downloadButton = screen.getByRole('button', {
      name: 'Compare',
    });

    await act(async () => {
      fireEvent.click(downloadButton);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
