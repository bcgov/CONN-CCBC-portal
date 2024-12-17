import { act, fireEvent, screen, waitFor } from '@testing-library/react';

import compiledManageReportingQuery, {
  manageReportsQuery,
} from '__generated__/manageReportsQuery.graphql';
import ManageReporting from 'pages/analyst/reporting/manage-reports';
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
              ccbcUserByCreatedBy: {
                sessionSub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              },
            },
          },
          {
            node: {
              rowId: 2,
              createdAt: '2024-06-27T01:50:51.270249+00:00',
              ccbcUserByCreatedBy: {
                sessionSub: '500ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              },
            },
          },
          {
            node: {
              rowId: 3,
              createdAt: '2024-06-26T01:51:05.63794+00:00',
              ccbcUserByCreatedBy: {
                sessionSub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              },
            },
          },
          {
            node: {
              rowId: 4,
              createdAt: '2024-06-25T01:53:22.963979+00:00',
              ccbcUserByCreatedBy: {
                sessionSub: '500ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              },
            },
          },
          {
            node: {
              rowId: 5,
              createdAt: '2024-06-24T01:55:04.948302+00:00',
              ccbcUserByCreatedBy: {
                sessionSub: '500ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              },
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

const pageTestingHelper = new PageTestingHelper<manageReportsQuery>({
  pageComponent: ManageReporting,
  compiledQuery: compiledManageReportingQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The Gcpe reporting page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/reporting/manage-reports',
    });
  });

  it('renders correct headings', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Manage My Reports')).toBeInTheDocument();
  });

  it('load correct reports belong to user', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByTestId('file-download-link')).toHaveLength(2);
    expect(
      screen.getByText(/Generated June 28, 2024 at 1:05 p.m. PDT/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Generated June 25, 2024 at 6:51 p.m. PDT/)
    ).toBeInTheDocument();
  });

  it('downloads an existing report', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const firstReport = screen.getAllByTestId('file-download-link')[0];

    await act(async () => {
      fireEvent.click(firstReport);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('delete report raises a confirmation dialog', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const deleteButton = screen.getAllByTestId('file-delete-btn')[0];

    fireEvent.click(deleteButton);

    expect(
      screen.getByText(/Are you sure you want to delete this GCPE file/)
    ).toBeInTheDocument();
  });

  it('delete report calls correct mutation', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(/Generated June 28, 2024 at 1:05 p.m. PDT/)
    ).toBeInTheDocument();

    const deleteButton = screen.getAllByTestId('file-delete-btn')[0];

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const confirmButton = screen.getByRole('button', {
      name: 'Delete',
    });

    expect(confirmButton).toBeInTheDocument();
    fireEvent.click(confirmButton);

    pageTestingHelper.expectMutationToBeCalled('archiveReportingGcpeMutation', {
      input: {
        reportingGcpePatch: expect.anything(),
        rowId: 1,
      },
    });

    pageTestingHelper.environment.mock.resolveMostRecentOperation({
      data: {
        updateReportingGcpeByRowId: {
          reportingGcpe: {
            rowId: 1,
            id: 'string',
          },
        },
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/GCPE file archived successfully/)
      ).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
