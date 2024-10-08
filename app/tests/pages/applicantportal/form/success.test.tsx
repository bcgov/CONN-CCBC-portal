import { screen } from '@testing-library/react';
import Success, {
  withRelayOptions,
} from '../../../../pages/applicantportal/form/[id]/success';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import compiledsuccessQuery, {
  successQuery,
} from '../../../../__generated__/successQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        status: 'submitted',
        ccbcNumber: 'CCBC-010001',
        intakeByIntakeId: {
          ccbcIntakeNumber: 1,
          closeTimestamp: '2022-09-06T23:59:59-07:00',
          rollingIntake: false,
        },
        projectName: 'Project testing title',
        updatedAt: '2022-08-15T16:43:28.973734-04:00',
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const mockQueryPayloadRollingIntake = {
  Query() {
    return {
      applicationByRowId: {
        status: 'submitted',
        ccbcNumber: 'CCBC-010001',
        intakeByIntakeId: {
          ccbcIntakeNumber: 1,
          closeTimestamp: '2022-09-06T23:59:59-07:00',
          rollingIntake: true,
        },
        projectName: 'Project testing title',
        updatedAt: '2022-08-15T16:43:28.973734-04:00',
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<successQuery>({
  pageComponent: Success,
  compiledQuery: compiledsuccessQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

afterEach(() => {
  pageTestingHelper.reinit();
});

it('displays the correct nav links when user is logged in', () => {
  pageTestingHelper.loadQuery();
  pageTestingHelper.renderPage();

  expect(screen.getByText('Logout')).toBeInTheDocument();
});

it('displays the correct CCBC ID', () => {
  pageTestingHelper.loadQuery();
  pageTestingHelper.renderPage();

  expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
});

it('displays the correct project name', () => {
  pageTestingHelper.loadQuery();
  pageTestingHelper.renderPage();

  expect(screen.getByText(', Project testing title,')).toBeInTheDocument();
});

it('displays the correct intake', () => {
  pageTestingHelper.loadQuery();
  pageTestingHelper.renderPage();

  expect(
    screen.getByText('Thank you for applying to CCBC Intake 1')
  ).toBeInTheDocument();
});

it('displays the correct save time', () => {
  pageTestingHelper.loadQuery();
  pageTestingHelper.renderPage();

  expect(
    screen.getByText(/2022-08-15 at 01:43 p.m. \(PDT\)/i)
  ).toBeInTheDocument();
});

it('displays the correct intake closing date', () => {
  pageTestingHelper.loadQuery();
  pageTestingHelper.renderPage();

  expect(
    screen.getByText(
      'You can edit this application until the intake closes on 2022-09-06'
    )
  ).toBeInTheDocument();
});

it('displays the correct message for rolling intake applications', () => {
  pageTestingHelper.loadQuery(mockQueryPayloadRollingIntake);
  pageTestingHelper.renderPage();

  expect(
    screen.queryByText(
      'You can edit this application until the intake closes on 2022-09-06'
    )
  ).not.toBeInTheDocument();
});

describe('The index page', () => {
  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/applicantportal/dashboard',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/applicantportal',
      },
    });
  });
});

describe('The form/success page', () => {
  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/applicantportal/form/1/success',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/applicantportal',
      },
    });
  });
});
