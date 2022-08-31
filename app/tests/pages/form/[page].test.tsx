import { withRelayOptions } from '../../../pages/form/[id]/success';
import { screen } from '@testing-library/react';
import FormPage from '../../../pages/form/[id]/[page]';
import PageTestingHelper from '../../utils/pageTestingHelper';
import compiledPageQuery, {
  PageQuery,
} from '../../../__generated__/PageQuery.graphql';
import { NextPageContext } from 'next';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        status: 'draft',
        ccbcNumber: 'CCBC-010001',
        intakeByIntakeId: {
          ccbcIntakeNumber: 1,
          closeTimestamp: '2022-09-06T23:59:59-07:00',
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

const pageTestingHelper = new PageTestingHelper<PageQuery>({
  pageComponent: FormPage,
  compiledQuery: compiledPageQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The form page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '1' },
    });
  });

  it('displays the correct nav links when user is logged in', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('does not display the alert or info banner when editing a draft application', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.queryByText(
        'You can no longer edit this application because it is withdrawn.'
      )
    ).toBeNull();

    expect(
      screen.queryByText('Edits are automatically saved and submitted.')
    ).toBeNull();
  });

  it('displays the info banner when editing a submitted application', () => {
    const mockQueryPayload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'submitted',
            ccbcNumber: 'CCBC-010001',
            intakeByIntakeId: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-09-06T23:59:59-07:00',
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
    pageTestingHelper.loadQuery(mockQueryPayload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText('Edits are automatically saved and submitted.')
    ).toBeInTheDocument();
  });

  it('displays the alert banner when editing a withdrawn application', () => {
    const mockQueryPayload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'withdrawn',
            ccbcNumber: 'CCBC-010002',
            intakeByIntakeId: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-09-06T23:59:59-07:00',
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

    pageTestingHelper.loadQuery(mockQueryPayload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        'You can no longer edit this application because it is withdrawn.'
      )
    ).toBeInTheDocument();
  });
  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/form/1/1',
      },
    } as NextPageContext;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/',
      },
    });
  });
});
