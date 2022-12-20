import { graphql } from 'react-relay';
import compiledQuery, {
  ChangeStatusTestQuery,
} from '__generated__/ChangeStatusTestQuery.graphql';
import { act, screen, fireEvent } from '@testing-library/react';
import ChangeStatus from 'components/Analyst/ChangeStatus';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import ComponentTestingHelper from '../../utils/componentTestingHelper';

const testQuery = graphql`
  query ChangeStatusTestQuery($rowId: Int!) {
    ...ChangeStatus_query
  }
`;

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        id: 'WyJhcHBsaWNhdGlvbnMiLDFd',
        status: 'received',
      },
      allApplicationStatusTypes: {
        ...allApplicationStatusTypes,
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<ChangeStatusTestQuery>({
    component: ChangeStatus,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      query: data,
    }),
  });

describe('The application header component', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('displays the current application status', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('Received')).toBeVisible();
    expect(screen.getByTestId('change-status')).toHaveValue('received');
  });

  it('has the correct style for the current status', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    expect(select).toHaveStyle(`color: #FFFFFF;`);
  });

  it('has the list of statuses', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Conditionally approved')).toBeInTheDocument();
    expect(screen.getByText('On hold')).toBeInTheDocument();
    expect(screen.getByText('Received')).toBeInTheDocument();
    expect(screen.getByText('Recommendation')).toBeInTheDocument();
    expect(screen.getByText('Screening')).toBeInTheDocument();
  });

  it('Changes color depending on which status is selected', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    fireEvent.change(select, { target: { value: 'assessment' } });
    expect(select).toHaveStyle(`color: #003366;`);

    fireEvent.change(select, { target: { value: 'on_hold' } });
    expect(select).toHaveStyle(`color: #A37000;`);
  });

  it('displays the confirmation modal and calls the mutation on save', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'assessment' } });
    });

    expect(screen.getByText('Reason for change')).toBeInTheDocument();

    const textarea = screen.getByTestId('reason-for-change');

    fireEvent.change(textarea, { target: { value: 'test text' } });

    const saveButton = screen.getByText('Save change');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createApplicationStatusMutation',
      {
        input: {
          applicationStatus: {
            applicationId: expect.any(Number),
            changeReason: 'test text',
            status: 'assessment',
          },
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          applicationStatus: {
            status: 'assessment',
          },
        },
      });
    });

    expect(screen.getByText('Assessment')).toBeVisible();
    expect(screen.getByTestId('change-status')).toHaveValue('assessment');
  });

  it('displays the correct status if saving is cancelled', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByTestId('change-status')).toHaveValue('received');

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'complete' } });
    });

    expect(screen.getByTestId('change-status')).toHaveValue('complete');

    const cancelButton = screen.getByText('Cancel change');

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(screen.getByText('Received')).toBeVisible();
    expect(screen.getByTestId('change-status')).toHaveValue('received');
  });
});
