import { act, fireEvent, screen } from '@testing-library/react';
import ApplicationIntakes from 'pages/analyst/admin/application-intakes';
import compiledApplicationIntakesQuery, {
  applicationIntakesQuery,
} from '__generated__/applicationIntakesQuery.graphql';
import cookie from 'js-cookie';
import { DateTime } from 'luxon';
import ALL_INTAKE_ZONES from 'data/intakeZones';
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
              rollingIntake: false,
              zones: [1, 2],
              allowUnlistedFnLedZones: false,
              hidden: false,
              hiddenCode: null,
              rowId: 1,
            },
          },
          {
            node: {
              ccbcIntakeNumber: 2,
              closeTimestamp: '2024-01-15T23:00:00-08:00',
              description: 'Intake 2 description',
              openTimestamp: '2023-01-15T00:00:00-08:00',
              rollingIntake: true,
              zones: [1, 2],
              allowUnlistedFnLedZones: false,
              hidden: false,
              hiddenCode: null,
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

const mockDeleteQueryPayload = {
  Query() {
    return {
      allIntakes: {
        edges: [
          {
            node: {
              ccbcIntakeNumber: 3,
              closeTimestamp: '2030-01-15T23:00:00-08:00',
              description: 'Intake 3 description',
              openTimestamp: '2031-01-15T00:00:00-08:00',
              rollingIntake: false,
              zones: [1],
              allowUnlistedFnLedZones: false,
              hidden: false,
              hiddenCode: null,
              rowId: 3,
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

const mockEditQueryPayload = {
  Query() {
    return {
      allIntakes: {
        edges: [
          {
            node: {
              ccbcIntakeNumber: 3,
              closeTimestamp: '2030-01-15T23:00:00-08:00',
              description: 'Intake 3 description',
              openTimestamp: '2031-01-15T00:00:00-08:00',
              rowId: 3,
              rollingIntake: false,
              zones: [1],
              allowUnlistedFnLedZones: false,
              hidden: false,
              hiddenCode: null,
            },
          },
          {
            node: {
              ccbcIntakeNumber: 2,
              closeTimestamp: '2029-01-15T23:00:00-08:00',
              description: 'Intake 3 description',
              openTimestamp: '2024-01-15T00:00:00-08:00',
              rowId: 3,
              rollingIntake: true,
              zones: [1, 2],
              allowUnlistedFnLedZones: false,
              hidden: false,
              hiddenCode: null,
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

const mockTimeMachineQueryPayload = {
  Query() {
    return {
      allIntakes: {
        edges: [
          {
            node: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-01-15T23:00:00-08:00',
              description: 'Intake 3 description',
              openTimestamp: '2021-01-15T00:00:00-08:00',
              rollingIntake: false,
              zones: [1],
              allowUnlistedFnLedZones: false,
              hidden: false,
              hiddenCode: null,
              rowId: 1,
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

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

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
        name: 'Actual end date and time',
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
      }).parentElement.parentElement
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

    const startDate = DateTime.now().plus({ days: 1 }).startOf('hour');
    const endDate = DateTime.now().plus({ days: 2 }).startOf('hour');

    await act(async () => {
      fireEvent.change(startDateInput, {
        target: {
          value: startDate.setLocale('en-US').toFormat('yyyy-MM-dd HH:mm a'),
        },
      });
    });

    await act(async () => {
      fireEvent.change(endDateInput, {
        target: {
          value: endDate.setLocale('en-US').toFormat('yyyy-MM-dd HH:mm a'),
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

    pageTestingHelper.expectMutationToBeCalled('createIntakeMutation', {
      connections: [
        'client:root:__ApplicationIntakes_allIntakes_connection(condition:{"archivedAt":null,"hidden":false},orderBy:"CCBC_INTAKE_NUMBER_DESC")',
      ],
      input: {
        intakeDescription: 'Test description',
        startTime: startDate.toUTC().toISO(),
        endTime: endDate.toUTC().toISO(),
        zones: [...ALL_INTAKE_ZONES],
        allowUnlistedFnLedZones: false,
        hiddenCode: null,
      },
    });

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {},
      });
    });
  });

  it('should delete a future intake', async () => {
    pageTestingHelper.loadQuery(mockDeleteQueryPayload);
    pageTestingHelper.renderPage();

    const deleteButton = screen.getByRole('button', {
      name: 'Delete',
    });

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    pageTestingHelper.expectMutationToBeCalled(
      'archiveIntakeMutation',

      {
        input: {
          intakeNumber: 3,
        },
      }
    );

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {},
      });
    });
  });

  it('should handle delete intake correctly when time machine is set', async () => {
    pageTestingHelper.loadQuery(mockTimeMachineQueryPayload);
    cookie.get.mockReturnValue('2021-01-01');
    pageTestingHelper.renderPage();

    const deleteButton = screen.getByRole('button', {
      name: 'Delete',
    });

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    pageTestingHelper.expectMutationToBeCalled('archiveIntakeMutation', {
      input: {
        intakeNumber: 1,
      },
    });

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {},
      });
    });
  });

  it('should edit an intake', async () => {
    pageTestingHelper.loadQuery(mockEditQueryPayload);
    pageTestingHelper.renderPage();

    const editButton = screen.getAllByTestId('edit-intake')[1];

    await act(async () => {
      fireEvent.click(editButton);
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

      fireEvent.change(endDateInput, {
        target: {
          value: '2025-07-02 00:00 AM',
        },
      });

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

    pageTestingHelper.expectMutationToBeCalled('updateIntakeMutation', {
      input: {
        intakeNumber: 2,
        startTime: '2025-07-01T07:00:00.000Z',
        endTime: '2025-07-02T07:00:00.000Z',
        intakeDescription: 'Test description',
        isRollingIntake: true,
        intakeZones: [1, 2],
        isAllowUnlistedFnLedZones: false,
        hiddenIntakeCode: null,
      },
    });

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {},
      });
    });
  });

  it('should handle edit intake correctly when time machine is set', async () => {
    pageTestingHelper.loadQuery(mockTimeMachineQueryPayload);
    cookie.get.mockReturnValue('2021-03-01');
    pageTestingHelper.renderPage();

    const editButton = screen.getByTestId('edit-intake');

    await act(async () => {
      fireEvent.click(editButton);
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
  });

  it('should not overlap the next intake when editing an intake', async () => {
    pageTestingHelper.loadQuery(mockEditQueryPayload);
    pageTestingHelper.renderPage();

    const editButton = screen.getAllByTestId('edit-intake')[1];

    await act(async () => {
      fireEvent.click(editButton);
    });

    const endDateInput = screen.getAllByPlaceholderText(
      'YYYY-MM-DD hh:mm aa'
    )[1];

    const descriptionInput = screen.getByTestId('root_description');

    expect(endDateInput).toBeVisible();

    expect(descriptionInput).toBeVisible();

    await act(async () => {
      fireEvent.change(endDateInput, {
        target: {
          value: '2033-07-02 00:00 AM',
        },
      });
    });

    expect(
      screen.getByText('End date & time must not overlap with the next intake')
    ).toBeVisible();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
