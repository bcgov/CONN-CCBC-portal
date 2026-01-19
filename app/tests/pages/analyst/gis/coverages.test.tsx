import { fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    COVERAGES_FILE_NAME: 'CCBC_APPLICATION_COVERAGES_AGGREGATED_NoDATA.zip',
  },
}));

// eslint-disable-next-line import/first
import coverages from 'pages/analyst/gis/coverages';

// eslint-disable-next-line import/first
import compiledCoveragesQuery, {
  coveragesQuery,
} from '__generated__/coveragesQuery.graphql';
// eslint-disable-next-line import/first
import PageTestingHelper from '../../../utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_admin',
      },
      allRecordVersions: {
        nodes: [
          {
            record: {
              id: 3,
              uuid: '56c849c1badc0b0ea5aa80001',
              created_at: '2025-01-07T15:28:41.793888+00:00',
              created_by: 336,
              updated_at: '2025-01-07T15:28:41.793888+00:00',
              updated_by: 336,
              archived_at: null,
              archived_by: null,
            },
            tableName: 'coverages_upload',
            createdBy: 336,
            createdAt: '2025-01-07T15:28:41.793888+00:00',
            ccbcUserByCreatedBy: {
              familyName: 'Tester',
              givenName: 'User2',
              id: 'WyJjY2JjX3VzZXJzIiwzMzZd',
            },
            id: 'WyJyZWNvcmRfdmVyc2lvbnMiLDM0MDcyXQ==',
          },
          {
            record: {
              id: 1,
              uuid: '116dae201f3ac6563e438a200',
              created_at: '2025-01-06T21:11:47.915184+00:00',
              created_by: 336,
              updated_at: '2025-01-06T21:11:47.915184+00:00',
              updated_by: 336,
              archived_at: null,
              archived_by: null,
            },
            tableName: 'coverages_upload',
            createdBy: 336,
            createdAt: '2025-01-06T21:11:47.915184+00:00',
            ccbcUserByCreatedBy: {
              familyName: 'Tester',
              givenName: 'User2',
              id: 'WyJjY2JjX3VzZXJzIiwzMzZd',
            },
            id: 'WyJyZWNvcmRfdmVyc2lvbnMiLDM0MDY4XQ==',
          },
          {
            record: {
              id: 2,
              uuid: '56c849c1badc0b0ea5aa80000',
              created_at: '2025-01-06T23:47:04.02607+00:00',
              created_by: 330,
              updated_at: '2025-01-06T23:47:04.02607+00:00',
              updated_by: 330,
              archived_at: null,
              archived_by: null,
            },
            tableName: 'coverages_upload',
            createdBy: 330,
            createdAt: '2025-01-06T23:47:04.02607+00:00',
            ccbcUserByCreatedBy: {
              familyName: 'Tester',
              givenName: 'User1',
              id: 'WyJjY2JjX3VzZXJzIiwzMzZd',
            },
            id: 'WyJyZWNvcmRfdmVyc2lvbnMiLDM0MDcxXQ==',
          },
        ],
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

const pageTestingHelper = new PageTestingHelper<coveragesQuery>({
  pageComponent: coverages,
  compiledQuery: compiledCoveragesQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The Gis coverages upload page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/gis/coverages',
    });
  });

  it('highlights the correct nav tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tabName = 'Application Coverages Upload';

    expect(
      screen.getByRole('link', {
        name: tabName,
      })
    ).toBeVisible();
  });

  it('renders correct controls', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    expect(screen.getByTestId('file-test')).toBeInTheDocument();

    const button = screen.getByRole('button', {
      name: 'Save',
    });
    expect(button.parentElement).toHaveAttribute('href', '/#');
    await act(async () => {
      await userEvent.click(button);
    });
  });

  it('handles incorrect file extension', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();
    const badfile = new File([new ArrayBuffer(1)], 'file.kmz', {
      type: 'application/vnd.google-earth.kmz',
    });

    const goodfile = new File(
      [new ArrayBuffer(1)],
      'CCBC_APPLICATION_COVERAGES_AGGREGATED_NoDATA.zip',
      {
        type: 'application/zip',
      }
    );

    const inputFile = screen.getAllByTestId('file-test')[0];
    const uploadBtn = screen.getByRole('button', {
      name: 'Upload Drop files (or click to upload)',
    });

    fireEvent.change(inputFile, { target: { files: [badfile] } });
    await act(async () => {
      await userEvent.click(uploadBtn);
    });

    expect(
      screen.getByText(
        'Please use an accepted file type. Accepted type for this field is: .zip'
      )
    ).toBeVisible();

    fireEvent.change(inputFile, { target: { files: [goodfile] } });
    await act(async () => {
      await userEvent.click(uploadBtn);
    });

    expect(
      screen.queryAllByText(
        'Please use an accepted file type. Accepted type for this field is: .zip'
      ).length
    ).toBe(0);
  });

  it('handles success response from backend', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'success' }),
      })
    ) as jest.Mock;
    global.alert = jest.fn() as jest.Mock;

    const goodfile = new File(
      [new ArrayBuffer(1)],
      'CCBC_APPLICATION_COVERAGES_AGGREGATED_NoDATA.zip',
      {
        type: 'application/zip',
      }
    );

    const inputFile = screen.getAllByTestId('file-test')[0];

    fireEvent.change(inputFile, { target: { files: [goodfile] } });

    const button = screen.getByRole('button', { name: 'Upload' });
    expect(button.parentElement).toHaveAttribute('href', '/#');
    await act(async () => {
      await userEvent.click(button);
    });
  });

  it('handles fetch error from backend', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('oops')),
      })
    ) as jest.Mock;
    global.alert = jest.fn() as jest.Mock;

    const goodfile = new File(
      [new ArrayBuffer(1)],
      'CCBC_APPLICATION_COVERAGES_AGGREGATED_NoDATA.zip',
      {
        type: 'application/zip',
      }
    );

    const inputFile = screen.getAllByTestId('file-test')[0];

    fireEvent.change(inputFile, { target: { files: [goodfile] } });

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.parentElement).toHaveAttribute('href', '/#');

    await act(async () => {
      await userEvent.click(button);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('The Gis history page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/gis/coverages',
    });
  });

  it('Load history component correctly', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Upload History')).toBeVisible();
  });

  it('renders correct table headers', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Uploaded by')).toBeVisible();
    expect(screen.getByText('File')).toBeVisible();
    expect(screen.getByText('Date uploaded')).toBeVisible();
  });

  it('renders correct history records', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const rows = document.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(3);

    const firstRowCells = rows[0].querySelectorAll('td');
    expect(firstRowCells[0]).toHaveTextContent('User1 Tester');
    expect(firstRowCells[1].querySelector('button')).toHaveTextContent(
      'CCBC_APPLICATION_COVERAGES_AGGREGATED_NoDATA.zip'
    );
    expect(firstRowCells[2]).toHaveTextContent(
      'January 7, 2025 at 7:28 a.m. PST'
    );

    const secondRowCells = rows[1].querySelectorAll('td');
    expect(secondRowCells[0]).toHaveTextContent('User1 Tester');
    expect(secondRowCells[2]).toHaveTextContent(
      'January 6, 2025 at 1:11 p.m. PST'
    );

    const thirdRowCells = rows[2].querySelectorAll('td');
    expect(thirdRowCells[0]).toHaveTextContent('User1 Tester');
    expect(thirdRowCells[2]).toHaveTextContent(
      'January 6, 2025 at 3:47 p.m. PST'
    );
  });

  it('correctly filters the record by uploaded date', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('January 7, 2025 at 7:28 a.m. PST')).toBeVisible();
    expect(screen.getByText('January 6, 2025 at 1:11 p.m. PST')).toBeVisible();

    const columnActions = document.querySelectorAll(
      '[aria-label="Show/Hide filters"]'
    )[0];

    await act(async () => {
      fireEvent.click(columnActions);
    });

    const dateFilter = screen.getByPlaceholderText(/Filter by Date/);

    expect(dateFilter).toBeInTheDocument();

    await act(async () => {
      fireEvent.keyDown(dateFilter, { key: 'Enter', code: 'Enter' });
    });

    await act(async () => {
      fireEvent.change(dateFilter, { target: { value: '2025-01-07' } });
    });

    await waitFor(() => {
      expect(
        screen.getByText('January 7, 2025 at 7:28 a.m. PST')
      ).toBeVisible();
      expect(
        screen.queryByText(/January 6, 2025 at 1:11 p.m. PST/)
      ).not.toBeInTheDocument();
    });
  });

  it('clear filter clears all the filtering', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('January 7, 2025 at 7:28 a.m. PST')).toBeVisible();
    expect(screen.getByText('January 6, 2025 at 1:11 p.m. PST')).toBeVisible();

    const columnActions = document.querySelectorAll(
      '[aria-label="Show/Hide filters"]'
    )[0];

    await act(async () => {
      fireEvent.click(columnActions);
    });

    const dateFilter = screen.getByPlaceholderText(/Filter by Date/);

    await act(async () => {
      fireEvent.keyDown(dateFilter, { key: 'Enter', code: 'Enter' });
    });

    await act(async () => {
      fireEvent.change(dateFilter, { target: { value: '2025-01-07' } });
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/January 6, 2025 at 1:11 p.m. PST/)
      ).not.toBeInTheDocument();
    });

    const clearFiltersBtn = screen.getByText('Clear Filtering');
    await act(async () => {
      fireEvent.click(clearFiltersBtn);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/January 6, 2025 at 1:11 p.m. PST/)
      ).toBeVisible();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
