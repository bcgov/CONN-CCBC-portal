import { withRelayOptions } from '../../../pages/form/[id]/success';
import { screen } from '@testing-library/react';
import Success from '../../../pages/form/[id]/success';
import PageTestingHelper from '../../utils/pageTestingHelper';
import compiledsuccessQuery, {
  successQuery,
} from '../../../__generated__/successQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        status: 'submitted',
        ccbcId: 'CCBC-010001',
        intakeId: 1,
        projectName: 'Project testing title',
        updatedAt: '2022-08-15T16:43:28.973734-04:00',
      },
      allIntakes: {
        edges: [
          {
            node: {
              ccbcIntakeNumber: 1,
              rowId: 1,
              closeTimestamp: '2022-09-06T23:59:59-07:00',
            },
          },
          {
            node: {
              ccbcIntakeNumber: 2,
              rowId: 2,
              closeTimestamp: '2022-11-06T23:59:59-08:00',
            },
          },
        ],
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

  expect(screen.getByText('Project testing title')).toBeInTheDocument();
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
  
  expect(screen.getByText(/2022-08-15 at 01:43 PM \(PDT\)/i)).toBeInTheDocument();
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

describe('The index page', () => {
  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/dashboard',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/',
      },
    });
  });
});

describe('The form/success page', () => {
  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/form/1/success',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/',
      },
    });
  });
});
