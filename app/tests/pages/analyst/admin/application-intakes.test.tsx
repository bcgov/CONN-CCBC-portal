import { act, fireEvent, screen } from '@testing-library/react';
import ApplicationIntakes from 'pages/analyst/admin/application-intakes';
import compiledApplicationIntakesQuery, {
  applicationIntakesQuery,
} from '__generated__/applicationIntakesQuery.graphql';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import { checkTabStyles, checkRouteAuthorization } from './shared-admin-tests';

const mockQueryPayload = {
  Query() {
    return {
      allIntakes: {
        edges: [
          {
            node: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-11-06T09:00:00-08:00',
              description: 'Intake 1 description',
              openTimestamp: '2022-08-19T09:00:00-07:00',
              rowId: 1,
            },
          },
          {
            node: {
              ccbcIntakeNumber: 2,
              closeTimestamp: '2024-01-15T23:00:00-08:00',
              description: 'Intake 2 description',
              openTimestamp: '2023-01-15T00:00:00-08:00',
              rowId: 2,
            },
          },
        ],
      },
      openIntake: {
        ccbcIntakeNumber: 2,
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_admin',
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

const pageTestingHelper = new PageTestingHelper<applicationIntakesQuery>({
  pageComponent: ApplicationIntakes,
  compiledQuery: compiledApplicationIntakesQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The Application intakes admin page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/admin/application-intakes',
    });
  });

  // Shared admin dashboard pages route authorization tests
  checkRouteAuthorization();

  it('highlights the correct nav tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tabName = 'Application intakes';

    // Shared admin dashboard pages tab styles test
    checkTabStyles(tabName);

    expect(
      screen.getByRole('link', {
        name: tabName,
      })
    ).toBeVisible();
  });

  it('displays the intakes', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', {
        name: 'Intake 1',
      })
    ).toBeVisible();

    expect(
      screen.getByRole('heading', {
        name: 'Intake 2',
      })
    ).toBeVisible();

    expect(
      screen.getAllByRole('heading', {
        name: 'Start date & time',
      })[0]
    ).toBeVisible();

    expect(
      screen.getAllByRole('heading', {
        name: 'End date & time',
      })[0]
    ).toBeVisible();

    expect(
      screen.getByText('January 15, 2023 at 12:00 a.m. PST')
    ).toBeVisible();

    expect(
      screen.getByText('January 15, 2024 at 11:00 p.m. PST')
    ).toBeVisible();

    expect(screen.getByText('August 19, 2022 at 9:00 a.m. PDT')).toBeVisible();

    expect(screen.getByText('November 6, 2022 at 9:00 a.m. PST')).toBeVisible();
  });

  it('should have the correct styling for the current intake', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', {
        name: 'Intake 2',
      }).parentElement
    ).toHaveStyle('border-left: 4px solid #3D9B50;');
  });

  it('should fill the intake form and save an intake', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const addButton = screen.getByRole('button', {
      name: 'Add intake',
    });

    await act(async () => {
      fireEvent.click(addButton);
    });

    const startDateInput = screen.getAllByPlaceholderText(
      'YYYY-MM-DD hh:mm aa'
    )[0];

    const endDateInput = screen.getAllByPlaceholderText(
      'YYYY-MM-DD hh:mm aa'
    )[1];

    const descriptionInput = screen.getByTestId('root_description');

    expect(startDateInput).toBeVisible();
    expect(endDateInput).toBeVisible();
    expect(descriptionInput).toBeVisible();

    await act(async () => {
      fireEvent.change(startDateInput, {
        target: {
          value: '2025-07-01 00:00 AM',
        },
      });
    });

    await act(async () => {
      fireEvent.change(endDateInput, {
        target: {
          value: '2025-07-02 00:00 AM',
        },
      });
    });

    await act(async () => {
      fireEvent.change(descriptionInput, {
        target: {
          value: 'Test description',
        },
      });
    });

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    pageTestingHelper.expectMutationToBeCalled(
      'createIntakeMutation',

      {
        connections: [
          'client:root:__ApplicationIntakes_allIntakes_connection(orderBy:"CCBC_INTAKE_NUMBER_DESC")',
        ],
        input: {
          intakeDescription: 'Test description',
          endTime: '2025-07-02T07:00:00.000Z',
          startTime: '2025-07-01T07:00:00.000Z',
        },
      }
    );

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {},
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
