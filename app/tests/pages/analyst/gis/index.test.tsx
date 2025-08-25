import { fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import gis from 'pages/analyst/gis/index';

import compiledGisUploadedQuery, {
  gisUploadedJsonQuery,
} from '__generated__/gisUploadedJsonQuery.graphql';
import PageTestingHelper from '../../../utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_admin',
      },
      allGisData: {
        nodes: [
          {
            jsonData: [
              {
                ccbc_number: 'CCBC-050077',
                GIS_TOTAL_HH: 0,
                json_featuretype: 'GIS_HH_ASSESSMENT_JSON_INTAKE_5',
                GIS_TOTAL_INDIG_HH: 0,
                GIS_PERCENT_OVERLAP: 0,
                number_of_households: 45,
                GIS_PERCENT_OVERBUILD: 0,
                GIS_TOTAL_ELIGIBLE_HH: 0,
                GIS_TOTAL_INELIGIBLE_HH: 0,
                GIS_TOTAL_ELIGIBLE_INDIG_HH: 0,
                households_impacted_indigenous: 0,
              },
              {
                ccbc_number: 'CCBC-050080',
                GIS_TOTAL_HH: 185.1,
                json_featuretype: 'GIS_HH_ASSESSMENT_JSON_INTAKE_5',
                GIS_TOTAL_INDIG_HH: 0,
                GIS_PERCENT_OVERLAP: 0,
                number_of_households: 185,
                GIS_PERCENT_OVERBUILD: 89,
                GIS_TOTAL_ELIGIBLE_HH: 20,
                GIS_TOTAL_INELIGIBLE_HH: 164,
                GIS_TOTAL_ELIGIBLE_INDIG_HH: 0,
                households_impacted_indigenous: 0,
              },
              {
                ccbc_number: 'CCBC-050075',
                GIS_TOTAL_HH: 2412,
                json_featuretype: 'GIS_HH_ASSESSMENT_JSON_INTAKE_5',
                GIS_TOTAL_INDIG_HH: 0,
                GIS_PERCENT_OVERLAP: 0,
                number_of_households: 389,
                GIS_PERCENT_OVERBUILD: 88,
                GIS_TOTAL_ELIGIBLE_HH: 299,
                GIS_TOTAL_INELIGIBLE_HH: 2112,
                GIS_TOTAL_ELIGIBLE_INDIG_HH: 0,
                households_impacted_indigenous: 0,
              },
            ],
            id: 'WyJnaXNfZGF0YSIsNzZd',
            fileName: null,
            createdBy: 186,
            createdAt: '2025-02-04T22:52:45.010064+00:00',
            ccbcUserByCreatedBy: {
              familyName: 'Tester',
              givenName: 'Admin',
              id: 'WyJjY2JjX3VzZXJzIiwxODZd',
            },
          },
          {
            jsonData: [
              {
                ccbc_number: 'CCBC-040062',
                GIS_TOTAL_HH: 38,
                GIS_TOTAL_INDIG_HH: 0,
                GIS_PERCENT_OVERLAP: 0,
                number_of_households: 63,
                GIS_PERCENT_OVERBUILD: 2,
                GIS_TOTAL_ELIGIBLE_HH: 37,
                GIS_TOTAL_INELIGIBLE_HH: 0,
                GIS_TOTAL_ELIGIBLE_INDIG_HH: 0,
                households_impacted_indigenous: 0,
              },
              {
                ccbc_number: 'CCBC-040072',
                GIS_TOTAL_HH: 495,
                GIS_TOTAL_INDIG_HH: 26,
                GIS_PERCENT_OVERLAP: 23,
                number_of_households: 497,
                GIS_PERCENT_OVERBUILD: 0,
                GIS_TOTAL_ELIGIBLE_HH: 495,
                GIS_TOTAL_INELIGIBLE_HH: 0,
                GIS_TOTAL_ELIGIBLE_INDIG_HH: 26,
                households_impacted_indigenous: 26,
              },
            ],
            id: 'WyJnaXNfZGF0YSIsNzVd',
            fileName: 'GIS_HH_ASSESSMENT_JSON_INTAKE_400.json',
            createdBy: 187,
            createdAt: '2024-07-23T21:21:02.154645+00:00',
            ccbcUserByCreatedBy: {
              familyName: 'Tester',
              givenName: 'Analyst',
              id: 'WyJjY2JjX3VzZXJzIiwxODdd',
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
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

const pageTestingHelper = new PageTestingHelper<gisUploadedJsonQuery>({
  pageComponent: gis,
  compiledQuery: compiledGisUploadedQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The Gis JSON upload history page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/gis',
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
    expect(rows).toHaveLength(2);

    const firstRowCells = rows[0].querySelectorAll('td');
    expect(firstRowCells[0]).toHaveTextContent('Admin Tester');
    expect(
      firstRowCells[1].querySelector('[data-testid="history-file-link"]')
    ).toHaveTextContent('GIS_HH_ASSESSMENT_JSON_INTAKE_5.json');
    expect(firstRowCells[2]).toHaveTextContent(
      'February 4, 2025 at 2:52 p.m. PST'
    );

    const secondRowCells = rows[1].querySelectorAll('td');
    expect(secondRowCells[0]).toHaveTextContent('Analyst Tester');
    expect(secondRowCells[2]).toHaveTextContent(
      'July 23, 2024 at 2:21 p.m. PDT'
    );
  });

  it('correctly filters the record by uploaded date', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('February 4, 2025 at 2:52 p.m. PST')).toBeVisible();
    expect(screen.getByText('July 23, 2024 at 2:21 p.m. PDT')).toBeVisible();

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
      fireEvent.change(dateFilter, { target: { value: '2025-02-04' } });
    });

    await waitFor(() => {
      expect(
        screen.getByText('February 4, 2025 at 2:52 p.m. PST')
      ).toBeVisible();
      expect(
        screen.queryByText(/July 23, 2024 at 2:21 p.m. PDT/)
      ).not.toBeInTheDocument();
    });
  });

  it('clear filter clears all the filtering', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('February 4, 2025 at 2:52 p.m. PST')).toBeVisible();
    expect(screen.getByText('July 23, 2024 at 2:21 p.m. PDT')).toBeVisible();

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
      fireEvent.change(dateFilter, { target: { value: '2025-02-04' } });
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/July 23, 2024 at 2:21 p.m. PDT/)
      ).not.toBeInTheDocument();
    });

    const clearFiltersBtn = screen.getByText('Clear Filtering');
    await act(async () => {
      fireEvent.click(clearFiltersBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/July 23, 2024 at 2:21 p.m. PDT/)).toBeVisible();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
