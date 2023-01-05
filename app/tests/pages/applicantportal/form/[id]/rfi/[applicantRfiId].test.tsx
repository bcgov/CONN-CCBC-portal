import { screen, fireEvent } from '@testing-library/react';
import ApplicantRfiPage from '../../../../../../pages/applicantportal/form/[id]/rfi/[applicantRfiId]';
import PageTestingHelper from '../../../../../utils/pageTestingHelper';
import compiledPageQuery, {
  ApplicantRfiIdQuery,
} from '../../../../../../__generated__/ApplicantRfiIdQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      rfiDataByRowId: {
        jsonData: {
          rfiDueBy: '2022-12-22',
        },
        rowId: 1,
        rfiNumber: 'CCBC-01001-01',
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      applicationByRowId: {
        rfi: {
          updatedAt: '2022-12-01',
        },
        projectName: 'projName',
        status: 'Received',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<ApplicantRfiIdQuery>({
  pageComponent: ApplicantRfiPage,
  compiledQuery: compiledPageQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    applicationId: 1,
    rfiId: 1,
  },
});

describe('The applicantRfiId Page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicantRfiId: '1', id: '1' },
    });
  });

  it('displays the rfiStatus header', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('projName')).toBeInTheDocument();
  });

  it('displays the due by date', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(/Please upload the following files by 2022-12-22/)
    ).toBeInTheDocument();
  });

  it('calls the updateRfiMutationWithTracking when clicking save', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    pageTestingHelper.expectMutationToBeCalled(
      'updateWithTrackingRfiMutation',
      {
        input: {
          jsonData: {
            rfiAdditionalFiles: {},
            rfiDueBy: '2022-12-22',
          },
          rfiRowId: 1,
        },
      }
    );
  });
});
