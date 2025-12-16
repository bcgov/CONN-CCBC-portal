import { graphql } from 'react-relay';
import compiledQuery, {
  ChangeStatusTestQuery,
} from '__generated__/ChangeStatusTestQuery.graphql';
import { act, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      internalDescription
      applicationProjectTypesByApplicationId(
        orderBy: CREATED_AT_DESC
        first: 1
      ) {
        nodes {
          projectType
        }
      }
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
        internalDescription: null,
        applicationProjectTypesByApplicationId: {
          nodes: [],
        },
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
        internalDescription: 'internal description',
        applicationProjectTypesByApplicationId: {
          nodes: [{ projectType: 'Project Type' }],
        },
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

const mockExistingMergeQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        id: 'WyJhcHBsaWNhdGlvbnMiLDFd',
        rowId: 1,
        analystStatus: 'merged',
        externalStatus: 'received',
        internalDescription: null,
        applicationMergesByChildApplicationId: {
          nodes: [
            {
              parentApplicationId: 2,
              parentCbcId: null,
              rowId: 10,
              childApplicationId: 1,
            },
          ],
        },
        applicationProjectTypesByApplicationId: {
          nodes: [],
        },
      },
      allApplicationStatusTypes: {
        ...allApplicationStatusTypes,
      },
    };
  },
};

const parentProjects = [
  { id: 2001, projectNumber: 'CCBC-2001', type: 'CCBC' },
  { id: 3002, projectNumber: 'CBC-3002', type: 'CBC' },
];

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
    expect(screen.getByText('Not selected')).toBeInTheDocument();
    expect(screen.getByText('Reporting complete')).toBeInTheDocument();
    expect(screen.getByText('Conditionally approved')).toBeInTheDocument();
    expect(screen.getByText('Merged')).toBeInTheDocument();
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
    expect(screen.getByText('Not selected')).toBeInTheDocument();
    expect(screen.getByText('Reporting complete')).toBeInTheDocument();
    expect(screen.getByText('Conditionally approved')).toBeInTheDocument();
    expect(screen.getByText('On hold')).toBeInTheDocument();
    expect(screen.getByText('Received')).toBeInTheDocument();
    expect(screen.getByText('Merged')).toBeInTheDocument();

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

    const modalElement = screen.getByTestId('external-change-status-modal');

    expect(modalElement).toBeInTheDocument();

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

    const saveButton = screen.getByText('Save change');
    await act(async () => {
      fireEvent.click(saveButton);
    });

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

  it('prompts for merge parent selection when choosing merged', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent(undefined, {
      parentList: parentProjects,
    });

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'merged' } });
    });

    expect(
      screen.getByText(
        'Please select the parent project and provide a reason for this change.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('merge-parent-autocomplete')).toBeInTheDocument();
  });

  it('creates merge relationship with a CCBC parent before saving merged status', async () => {
    const user = userEvent.setup();
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent(undefined, {
      parentList: parentProjects,
    });

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'merged' } });
    });

    const autocompleteInput = within(
      screen.getByTestId('merge-parent-autocomplete')
    ).getByRole('combobox');

    await user.click(autocompleteInput);
    await user.type(autocompleteInput, 'CCBC-2001');
    await user.click(screen.getByText('CCBC-2001'));

    const saveButton = screen.getByText('Save change');
    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'mergeApplicationMutation',
      expect.objectContaining({
        input: {
          _childApplicationId: 1,
          _changeReason: '',
          _parentApplicationId: 2001,
          _parentCbcId: null,
        },
        connections: expect.any(Array),
      })
    );
    componentTestingHelper.expectMutationToBeCalled(
      'createApplicationStatusMutation',
      {
        input: {
          applicationStatus: {
            applicationId: expect.any(Number),
            changeReason: '',
            status: 'merged',
          },
        },
      }
    );

    const resolveOperation = (operation) => {
      if (operation.request.node.params.name === 'mergeApplicationMutation') {
        return {
          data: {
            mergeApplication: {
              applicationMerge: {
                id: 'mock-merge-id',
                parentApplicationId: 2001,
                parentCbcId: null,
                childApplicationId: 1,
                changeReason: '',
              },
            },
          },
        };
      }

      return {
        data: {
          applicationStatus: {
            status: 'merged',
          },
        },
      };
    };

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation(
        resolveOperation
      );
      componentTestingHelper.environment.mock.resolveMostRecentOperation(
        resolveOperation
      );
    });

    expect(screen.getByTestId('change-status')).toHaveValue('merged');
  });

  it('archives merge relationship when moving away from merged', async () => {
    componentTestingHelper.loadQuery(mockExistingMergeQueryPayload);
    componentTestingHelper.renderComponent(undefined, {
      parentList: parentProjects,
    });

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'assessment' } });
    });

    const saveButton = screen.getByText('Save change');
    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'archiveApplicationMergeMutation',
      {
        input: {
          _childApplicationId: 1,
          _changeReason: '',
        },
      }
    );
    componentTestingHelper.expectMutationToBeCalled(
      'createApplicationStatusMutation',
      {
        input: {
          applicationStatus: {
            applicationId: expect.any(Number),
            changeReason: '',
            status: 'assessment',
          },
        },
      }
    );

    const resolveOperation = (operation) => {
      if (
        operation.request.node.params.name === 'archiveApplicationMergeMutation'
      ) {
        return {
          data: {
            archiveApplicationMerge: {
              applicationMerge: {
                id: 'mock-merge-id',
                parentApplicationId: 2,
                parentCbcId: null,
                childApplicationId: 1,
                archivedAt: '2024-01-01',
                changeReason: '',
              },
            },
          },
        };
      }

      return {
        data: {
          applicationStatus: {
            status: 'assessment',
          },
        },
      };
    };

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation(
        resolveOperation
      );
      componentTestingHelper.environment.mock.resolveMostRecentOperation(
        resolveOperation
      );
    });

    expect(screen.getByTestId('change-status')).toHaveValue('assessment');
  });

  it('sends notification once internal status is changed to agreement signed', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'approved' } });
    });

    expect(screen.getByTestId('change-status')).toHaveValue('approved');

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    const okButton = screen.getByText('Save change');
    await act(async () => {
      fireEvent.click(okButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createApplicationStatusMutation',
      expect.anything()
    );
    componentTestingHelper.environment.mock.resolveMostRecentOperation({
      errors: [],
      data: {},
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/email/notifyAgreementSigned',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.anything(),
      }
    );
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/email/notifyAgreementSignedDataTeam',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.anything(),
      }
    );
  });

  it('sends notification once internal status is changed to conditionally approved', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'conditionally_approved' } });
    });

    expect(screen.getByTestId('change-status')).toHaveValue(
      'conditionally_approved'
    );

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    const okButton = screen.getByText('Save change');
    await act(async () => {
      fireEvent.click(okButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createApplicationStatusMutation',
      expect.anything()
    );
    componentTestingHelper.environment.mock.resolveMostRecentOperation({
      errors: [],
      data: {},
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/email/notifyConditionalApproval',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.anything(),
      }
    );
  });

  it('does not send notification when internal status is changed to conditionally approved but fields are not empty', async () => {
    componentTestingHelper.loadQuery(mockConditionalApprovalQueryPayload);
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'conditionally_approved' } });
    });

    expect(screen.getByTestId('change-status')).toHaveValue(
      'conditionally_approved'
    );

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    const okButton = screen.getByText('Save change');
    await act(async () => {
      fireEvent.click(okButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createApplicationStatusMutation',
      expect.anything()
    );
    componentTestingHelper.environment.mock.resolveMostRecentOperation({
      errors: [],
      data: {},
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
