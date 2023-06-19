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
    applicationByRowId(rowId: $rowId) {
      analystLead
      analystStatus
      organizationName
      ccbcNumber
      projectName
      rowId
      externalStatus
      ...AssignPackage_query
      ...ChangeStatus_query
    }
    ...AssignLead_query
    allApplicationStatusTypes(
      orderBy: STATUS_ORDER_ASC
      condition: { visibleByAnalyst: true }
    ) {
      nodes {
        name
        description
        id
      }
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
      },
      allApplicationStatusTypes: {
        ...allApplicationStatusTypes,
      },
    };
  },
};

const mockConditionalApprovalQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        id: 'WyJhcHBsaWNhdGlvbnMiLDFd',
        rowId: 1,
        analystStatus: 'conditionally_approved',
        externalStatus: 'received',
        conditionalApprovalDataByApplicationId: {
          edges: [
            {
              node: {
                jsonData: {
                  decision: {
                    ministerDecision: 'Approved',
                  },
                  response: {
                    applicantResponse: 'Accepted',
                  },
                },
              },
            },
          ],
        },
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
      application: data.applicationByRowId,
      statusList: data.allApplicationStatusTypes.nodes,
      status: data.applicationByRowId.analystStatus,
      hiddenStatusTypes: ['draft', 'submitted', 'withdrawn'],
      isExternalStatus: false,
    }),
  });

const externalComponentTestingHelper =
  new ComponentTestingHelper<ChangeStatusTestQuery>({
    component: ChangeStatus,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.applicationByRowId,
      statusList: data.allApplicationStatusTypes.nodes,
      status: data.applicationByRowId.externalStatus,
      hiddenStatusTypes: [
        'assessment',
        'draft',
        'recommendation',
        'screening',
        'submitted',
        'withdrawn',
      ],
      isExternalStatus: true,
    }),
  });

describe('The application header component', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
    externalComponentTestingHelper.reinit();
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

  it('has the list of external statuses', () => {
    externalComponentTestingHelper.loadQuery();
    externalComponentTestingHelper.renderComponent();

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Conditionally approved')).toBeInTheDocument();
    expect(screen.getByText('On hold')).toBeInTheDocument();
    expect(screen.getByText('Received')).toBeInTheDocument();

    expect(screen.queryByText('Assessment')).not.toBeInTheDocument();
    expect(screen.queryByText('Recommendation')).not.toBeInTheDocument();
    expect(screen.queryByText('Screening')).not.toBeInTheDocument();
  });

  it('displays the change internal status first modal', async () => {
    externalComponentTestingHelper.loadQuery();
    externalComponentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'approved' } });
    });

    expect(screen.getByTestId('change-status')).toHaveValue('approved');

    const okButton = screen.getByText('Ok');
    await act(async () => {
      fireEvent.click(okButton);
    });

    expect(screen.getByTestId('change-status')).toHaveValue('on_hold');
  });

  it('displays the change external status modal', async () => {
    externalComponentTestingHelper.loadQuery();
    externalComponentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'conditionally_approved' } });
    });

    const closeButton = screen.getByText('Close');
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(screen.getByTestId('change-status')).toHaveValue('on_hold');
  });

  it('changes the external status to conditional approval once the correct conditions are met', async () => {
    externalComponentTestingHelper.loadQuery(
      mockConditionalApprovalQueryPayload
    );
    externalComponentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    expect(screen.getByTestId('change-status')).toHaveValue('received');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'conditionally_approved' } });
    });

    expect(screen.getByTestId('change-status')).toHaveValue(
      'conditionally_approved'
    );

    externalComponentTestingHelper.expectMutationToBeCalled(
      'createApplicationStatusMutation',
      {
        input: {
          applicationStatus: {
            applicationId: 1,
            changeReason: '',
            status: 'applicant_conditionally_approved',
          },
        },
      }
    );

    act(() => {
      externalComponentTestingHelper.environment.mock.resolveMostRecentOperation(
        {
          data: {
            applicationStatus: {
              externalStatus: 'conditionally_approved',
            },
          },
        }
      );
    });

    expect(screen.getByTestId('change-status')).toHaveValue(
      'conditionally_approved'
    );
  });
});
