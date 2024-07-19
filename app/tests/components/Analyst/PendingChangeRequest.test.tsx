import { graphql } from 'react-relay';
import compiledQuery, {
  PendingChangeRequestTestQuery,
} from '__generated__/PendingChangeRequestTestQuery.graphql';
import { act, screen, fireEvent } from '@testing-library/react';
import { PendingChangeRequest } from 'components/Analyst';
import { performQuery } from '../../../backend/lib/graphql';
import ComponentTestingHelper from '../../utils/componentTestingHelper';

jest.mock('../../../backend/lib/graphql', () => ({
  performQuery: jest.fn(),
}));

const testQuery = graphql`
  query PendingChangeRequestTestQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...PendingChangeRequest_query_application
    }
    cbcByRowId(rowId: $rowId) {
      ...PendingChangeRequest_query_cbc
    }
  }
`;

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        id: 'WyJhcHBsaWNhdGlvbnMiLDFd',
        rowId: 1,
        analystStatus: 'received',
        externalStatus: 'on_hold',
        applicationPendingChangeRequestsByApplicationId: {
          nodes: [
            {
              comment: 'test comment',
              isPending: true,
            },
          ],
        },
      },
    };
  },
};

const mockQueryPayloadCbc = {
  Query() {
    return {
      cbcByRowId: {
        id: 'WyJjYmMiLDFd',
        rowId: 1,
        analystStatus: 'received',
        externalStatus: 'on_hold',
        cbcApplicationPendingChangeRequestsByCbcId: {
          nodes: [
            {
              comment: 'test comment for CBC',
              isPending: true,
            },
          ],
        },
      },
    };
  },
};

const mockEmptyQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        id: 'WyJhcHBsaWNhdGlvbnMiLDFd',
        rowId: 1,
        analystStatus: 'received',
        externalStatus: 'on_hold',
        applicationPendingChangeRequestsByApplicationId: {
          nodes: [],
        },
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<PendingChangeRequestTestQuery>({
    component: PendingChangeRequest,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.applicationByRowId,
      isCbc: false,
      isHeaderEditable: true,
    }),
  });

const componentTestingHelperCbc =
  new ComponentTestingHelper<PendingChangeRequestTestQuery>({
    component: PendingChangeRequest,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayloadCbc,
    getPropsFromTestQuery: (data) => ({
      application: data.cbcByRowId,
      isCbc: true,
      isHeaderEditable: true,
    }),
  });

const componentTestingHelperReadOnly =
  new ComponentTestingHelper<PendingChangeRequestTestQuery>({
    component: PendingChangeRequest,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayloadCbc,
    getPropsFromTestQuery: (data) => ({
      application: data.cbcByRowId,
      isCbc: true,
    }),
  });

describe('The Pending Change Request component', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
    componentTestingHelperCbc.reinit();
  });

  it('render the checkbox and comment icon correctly', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByTestId('pending-change-request-comments')).toBeVisible();
    expect(screen.getByTestId('pending-change-request-checkbox')).toBeVisible();
  });

  it('renders the checkbox and comment icon correctly for CBC', async () => {
    componentTestingHelperCbc.loadQuery();
    componentTestingHelperCbc.renderComponent();

    expect(screen.getByTestId('pending-change-request-checkbox')).toBeVisible();
    expect(screen.getByTestId('pending-change-request-comments')).toBeVisible();

    const commentIcon = screen.getByTestId('pending-change-request-comments');
    await act(async () => {
      fireEvent.click(commentIcon);
    });

    expect(screen.getByText('test comment for CBC')).toBeVisible();
  });

  it('edit comment modal save button calls correct mutation for CBC', async () => {
    componentTestingHelperCbc.loadQuery();
    componentTestingHelperCbc.renderComponent();

    const commentIcon = screen.getByTestId('pending-change-request-comments');

    await act(async () => {
      fireEvent.click(commentIcon);
    });

    const textArea = screen.getByTestId('root_comment');

    fireEvent.change(textArea, {
      target: { value: 'Edited comment.' },
    });

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelperCbc.expectMutationToBeCalled(
      'createCbcPendingChangeRequestMutation',
      {
        input: {
          _cbcId: 1,
          _comment: 'Edited comment.',
          _isPending: true,
        },
      }
    );
  });

  it('load edit comment modal when clicked comment icon', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const commentIcon = screen.getByTestId('pending-change-request-comments');

    await act(async () => {
      fireEvent.click(commentIcon);
    });

    expect(
      screen.getByText('Comments on pending changes (optional)')
    ).toBeVisible();

    expect(screen.getByText('test comment')).toBeVisible();

    const saveButton = screen.getByTestId('pending-request-change-save-btn');
    expect(saveButton).toBeDisabled();

    const cancelButton = screen.getByTestId(
      'pending-request-change-cancel-btn'
    );
    expect(cancelButton).toBeEnabled();
  });

  it('edit comment modal save button calls correct mutation', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const commentIcon = screen.getByTestId('pending-change-request-comments');

    await act(async () => {
      fireEvent.click(commentIcon);
    });

    const textArea = screen.getByTestId('root_comment');

    fireEvent.change(textArea, {
      target: { value: 'Edited comment.' },
    });

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createPendingChangeRequestMutation',
      {
        input: {
          _applicationId: 1,
          _comment: 'Edited comment.',
          _isPending: true,
        },
      }
    );
  });

  it('unchecking pending change request checkbox opens modal with mandatory options', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const checkbox = screen.getByTestId('pending-change-request-checkbox');
    await act(async () => {
      fireEvent.click(checkbox);
    });

    expect(screen.getByText('Done with this change request?')).toBeVisible();

    expect(screen.getByText('Yes, change request completed')).toBeVisible();
    expect(screen.getByText('Yes, change request cancelled')).toBeVisible();

    const cancelButton = screen.getByTestId('pending-request-change-save-btn');
    expect(cancelButton).toBeDisabled();

    const radioInput = screen.getByRole('radio', {
      name: 'root_comment-1',
    });

    await act(async () => {
      fireEvent.click(radioInput);
    });

    expect(cancelButton).toBeEnabled();
  });

  it('unchecking pending change request calls correct mutation', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const checkbox = screen.getByTestId('pending-change-request-checkbox');
    await act(async () => {
      fireEvent.click(checkbox);
    });

    const saveButton = screen.getByTestId('pending-request-change-save-btn');
    const radioInput = screen.getByRole('radio', {
      name: 'root_comment-1',
    });

    await act(async () => {
      fireEvent.click(radioInput);
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createPendingChangeRequestMutation',
      {
        input: {
          _applicationId: 1,
          _comment: 'Yes, change request cancelled',
          _isPending: false,
        },
      }
    );
  });

  it('checking pending change request checkbox opens modal with optional comments', async () => {
    componentTestingHelper.loadQuery(mockEmptyQueryPayload);
    componentTestingHelper.renderComponent();

    expect(
      screen.queryByTestId('pending-change-request-comments')
    ).not.toBeInTheDocument();

    const checkbox = screen.getByTestId('pending-change-request-checkbox');
    await act(async () => {
      fireEvent.click(checkbox);
    });

    expect(
      screen.getByText('Comments on pending changes (optional)')
    ).toBeVisible();

    const saveButton = screen.getByTestId('pending-request-change-save-btn');

    expect(saveButton).toBeEnabled();

    const cancelButton = screen.getByTestId(
      'pending-request-change-cancel-btn'
    );

    expect(cancelButton).toBeEnabled();
  });

  it('save comment button calls correct mutation', async () => {
    componentTestingHelper.loadQuery(mockEmptyQueryPayload);
    componentTestingHelper.renderComponent();

    const checkBox = screen.getByTestId('pending-change-request-checkbox');

    expect(checkBox).toBeVisible();

    await act(async () => {
      fireEvent.click(checkBox);
    });

    expect(
      screen.getByText('Comments on pending changes (optional)')
    ).toBeVisible();

    const textArea = screen.getByTestId('root_comment');

    fireEvent.change(textArea, {
      target: { value: 'This is a test comment.' },
    });

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createPendingChangeRequestMutation',
      {
        input: {
          _applicationId: 1,
          _comment: 'This is a test comment.',
          _isPending: true,
        },
      }
    );
  });

  it('create pending change request comments are optional', async () => {
    componentTestingHelper.loadQuery(mockEmptyQueryPayload);
    componentTestingHelper.renderComponent();

    const checkBox = screen.getByTestId('pending-change-request-checkbox');

    expect(checkBox).toBeVisible();

    await act(async () => {
      fireEvent.click(checkBox);
    });

    expect(
      screen.getByText('Comments on pending changes (optional)')
    ).toBeVisible();

    const cancelButton = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createPendingChangeRequestMutation',
      {
        input: {
          _applicationId: 1,
          _comment: null,
          _isPending: true,
        },
      }
    );
  });

  it('pending change request close button handle modal close only', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const commentIcon = screen.getByTestId('pending-change-request-comments');

    expect(commentIcon).toBeVisible();

    await act(async () => {
      fireEvent.click(commentIcon);
    });

    expect(
      screen.getByText('Comments on pending changes (optional)')
    ).toBeVisible();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(
      screen.getByText('Comments on pending changes (optional)')
    ).not.toBeVisible();

    expect(performQuery).not.toHaveBeenCalled();
  });

  it('Closing change request modal keep pending button closes modal and keep change request', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const checkbox = screen.getByTestId('pending-change-request-checkbox');

    expect(checkbox).toBeVisible();

    await act(async () => {
      fireEvent.click(checkbox);
    });

    const cancelButton = screen.getByRole('button', {
      name: 'No, Keep Pending',
    });

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(
      screen.getByText('Done with this change request?')
    ).not.toBeVisible();

    expect(performQuery).not.toHaveBeenCalled();
  });

  it('load checkbox correctly in edit mode', async () => {
    componentTestingHelperReadOnly.loadQuery();
    componentTestingHelperReadOnly.renderComponent();

    const checkBox = screen.getByTestId('pending-change-request-checkbox');

    expect(checkBox).toBeChecked();
    expect(checkBox).toBeEnabled();
  });

  it('load edit comment modal when clicked comment icon when editable', async () => {
    componentTestingHelperReadOnly.loadQuery();
    componentTestingHelperReadOnly.renderComponent();

    const commentIcon = screen.getByTestId('pending-change-request-comments');

    await act(async () => {
      fireEvent.click(commentIcon);
    });

    expect(
      screen.getByText('Comments on pending changes (optional)')
    ).toBeVisible();

    expect(screen.getByText('test comment for CBC')).toBeVisible();
    const textArea = screen.getByTestId('root_comment');

    expect(textArea).toBeEnabled();

    const saveButton = screen.queryByTestId('pending-request-change-save-btn');
    expect(saveButton).toBeInTheDocument();

    const cancelButton = screen.queryByTestId(
      'pending-request-change-cancel-btn'
    );
    expect(cancelButton).toBeInTheDocument();
  });
});
