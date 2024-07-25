import { fireEvent, render, screen } from '@testing-library/react';
import compiledQuery, {
  AnnouncementsFormTestQuery,
} from '__generated__/AnnouncementsFormTestQuery.graphql';
import { AnnouncementsForm } from 'components/Analyst/Project/Announcements';
import {
  toastContent,
  updateStoreAfterDelete,
} from 'components/Analyst/Project/Announcements/AnnouncementsForm';
import { act } from 'react';
import { graphql } from 'react-relay';

import GlobalTheme from 'styles/GlobalTheme';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';

const testQuery = graphql`
  query AnnouncementsFormTestQuery($rowId: Int!) {
    ...AnnouncementsForm_query
  }
`;

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        id: 'TestApplicationId',
        rowId: 1,
        ccbcNumber: '123456789',
        announced: false,
        announcements: {
          edges: [
            {
              node: {
                id: '1',
                rowId: 1,
                jsonData: {},
                ccbcNumbers: '123456789',
              },
            },
          ],
        },
      },
      allApplications: {
        nodes: [
          {
            ccbcNumber: '123456789',
            rowId: 1,
          },
        ],
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<AnnouncementsFormTestQuery>({
    component: AnnouncementsForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      query: data,
      isExpanded: true,
    }),
  });

describe('Test pure functions in AnnouncementsForm', () => {
  it('renders all links when there are less than three ccbcIds', () => {
    const ccbcIds = [
      { ccbcNumber: '123', rowId: '1' },
      { ccbcNumber: '456', rowId: '2' },
    ];
    render(<GlobalTheme>{toastContent(ccbcIds)}</GlobalTheme>);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(ccbcIds.length);

    ccbcIds.forEach((ccbcId, index) => {
      expect(links[index]).toHaveAttribute(
        'href',
        `/analyst/application/${ccbcId.rowId}/project`
      );
      expect(links[index]).toHaveTextContent(ccbcId.ccbcNumber);
    });
  });

  it('renders only the first two links and "and more" when there are three or more ccbcIds', () => {
    const ccbcIds = [
      { ccbcNumber: '123', rowId: '1' },
      { ccbcNumber: '456', rowId: '2' },
      { ccbcNumber: '789', rowId: '3' },
      { ccbcNumber: '321', rowId: '3' },
    ];
    render(<GlobalTheme>{toastContent(ccbcIds)}</GlobalTheme>);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);

    ccbcIds.slice(0, 2).forEach((ccbcId, index) => {
      expect(links[index]).toHaveAttribute(
        'href',
        `/analyst/application/${ccbcId.rowId}/project`
      );
      expect(links[index]).toHaveTextContent(ccbcId.ccbcNumber);
    });

    expect(screen.getByText(/and more/)).toBeInTheDocument();
  });

  it('renders announcement with empty ccbcIds', () => {
    const ccbcIds = [];
    render(<GlobalTheme>{toastContent(ccbcIds)}</GlobalTheme>);

    expect(
      screen.getByText('Announcement successfully added')
    ).toBeInTheDocument();
  });

  it('renders announcement with undefined ccbcIds', () => {
    const ccbcIds = undefined;
    render(<GlobalTheme>{toastContent(ccbcIds)}</GlobalTheme>);

    expect(
      screen.getByText('Announcement successfully added')
    ).toBeInTheDocument();
  });

  it('Test calls made by updateStoreAfterDelete', () => {
    const relayConnectionId = 'something';
    const announcement = { id: 1 };
    jest.mock('react-relay', () => {
      return {
        ConnectionHandler: {
          deleteNode: jest.fn(),
        },
      };
    });

    const mockStore = {
      get: jest.fn(() => {
        return {
          getLinkedRecords: () => [],
        };
      }),
      delete: jest.fn(),
    };
    updateStoreAfterDelete(mockStore, relayConnectionId, announcement);
    expect(mockStore.get).toHaveBeenCalledWith(relayConnectionId);
    expect(mockStore.delete).toHaveBeenCalledWith(announcement.id);
  });
});

describe('Announcement Form Announced by checkbox', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('renders the form when the application is not announced', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const checkbox = screen.getByTestId('announced-checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    await act(async () => {
      fireEvent.click(checkbox);
    });

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createApplicationAnnouncedRecord: {
            application: {
              id: 'TestApplicationId',
              announced: true,
            },
          },
        },
      });
    });

    expect(checkbox).toBeChecked();
  });
});
