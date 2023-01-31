import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DownloadAttachments from 'pages/analyst/admin/download-attachments';

import compiledDownloadAttachmentsQuery, {
  downloadAttachmentsQuery,
} from '__generated__/downloadAttachmentsQuery.graphql';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import { checkTabStyles, checkRouteAuthorization } from './shared-admin-tests';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_admin',
      },
      allIntakes: {
        nodes: [ 
          {
            ccbcIntakeNumber: 1,
            closeTimestamp: '2022-08-09T13:49:23-07:00',
            openTimestamp: '2022-07-25T00:00:00-07:00',
            rowId: 1
          }, 
          {
            ccbcIntakeNumber: 2,
            openTimestamp: '2022-09-19T09:00:00-07:00',
            closeTimestamp: '2023-01-02T09:00:00-07:00',
            rowId: 2
          }, 
          {
            ccbcIntakeNumber: 3,
            openTimestamp: '2042-09-19T09:00:00-07:00',
            closeTimestamp: '2043-01-02T09:00:00-07:00',
            rowId: 2
          }
        ]
      }
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

const pageTestingHelper = new PageTestingHelper<downloadAttachmentsQuery>({
  pageComponent: DownloadAttachments,
  compiledQuery: compiledDownloadAttachmentsQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The Download attachments admin page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/admin/download-attachments',
    });
  });

  // Shared admin dashboard pages route authorization tests
  checkRouteAuthorization();

  it('highlights the correct nav tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tabName = 'Download attachments';

    // Shared admin dashboard pages tab styles test
    checkTabStyles(tabName);

    expect(
      screen.getByRole('link', {
        name: tabName,
      })
    ).toBeVisible();
  });

  it('renders list of intakes in dropdown', async() => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('select-intake-test')).toBeInTheDocument();
    expect(screen.getByText('Export attachments')).toBeInTheDocument();

    expect(
      screen.getAllByRole('option', { name: 'Intake 1. July 25, 2022 - August 09, 2022'})[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('option', { name: 'Intake 2. September 19, 2022 - January 02, 2023' })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('option').length
    ).toBe(2);
  });

  it('produces correct link to the attachment archive', async() => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('select-intake-test')).toBeInTheDocument();

    const secondIntake =  screen.getAllByRole('option', { name: 'Intake 2. September 19, 2022 - January 02, 2023' })[0];
    await act(async () => {
      await userEvent.selectOptions(screen.getByTestId('select-intake-test'), secondIntake);
    });
 
    const link = screen.getByRole('button', { name: 'Export attachments' });
    expect(link).toHaveAttribute(
      'href',
      '/api/analyst/admin-archive/2'
    );

  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
