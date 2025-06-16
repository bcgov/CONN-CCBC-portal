import ConditionalApprovalForm from 'components/Analyst/Project/ConditionalApproval/ConditionalApprovalForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';

const testQuery = graphql`
  query ConditionalApprovalFormTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    application(id: "TestApplicationId") {
      ...ConditionalApprovalForm_application
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationId',
      rowId: 1,
      ccbcNumber: '123456789',
      conditionalApproval: {
        jsonData: null,
      },
      conditionalApprovalDataByApplicationId: {
        edges: [
          {
            node: {
              id: 'test-id',
              jsonData: null,
            },
          },
        ],
      },
    };
  },
};

const mockJsonDataQueryPayload = {
  Application() {
    return {
      rowId: 1,
      amendmentNumbers: '0 1 2 3',
      ccbcNumber: 'CCBC-010003',
      conditionalApproval: {
        jsonData: {
          decision: {
            ministerDecision: 'Approved',
          },
          isedDecisionObj: {},
          letterOfApproval: {},
          response: {
            applicantResponse: 'Accepted',
          },
        },
      },
      conditionalApprovalDataByApplicationId: {
        edges: [
          {
            node: {
              id: 'test-id',
              jsonData: {
                decision: {
                  ministerDecision: 'Approved',
                },
                isedDecisionObj: {},
                letterOfApproval: {},
                response: {
                  applicantResponse: 'Accepted',
                },
              },
            },
          },
        ],
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<ApplicationFormTestQuery>({
    component: ConditionalApprovalForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      isExpanded: true,
    }),
  });

describe('The Conditional Approval form', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('displays the form', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Conditional approval' })
    ).toBeVisible();
  });

  it('displays the form titles', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const editButton = screen.getAllByTestId('project-form-edit-button')[0];
    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(screen.getByText(`Minister's decision`)).toBeInTheDocument();
    expect(screen.getByText('BC')).toBeInTheDocument();
    expect(screen.getByText('ISED')).toBeInTheDocument();
    expect(
      screen.getByText("Minister's decision, letter, and response")
    ).toBeInTheDocument();
    expect(screen.getByText(`Applicant's response`)).toBeInTheDocument();
    expect(
      screen.getByText('Date letter sent to applicant')
    ).toBeInTheDocument();
    expect(screen.getByText('Status that applicant sees')).toBeInTheDocument();
  });

  it('should open by default the read only form when json data exists', async () => {
    componentTestingHelper.loadQuery(mockJsonDataQueryPayload);
    componentTestingHelper.renderComponent();

    expect(screen.getByTestId('read-only-response-widget')).toHaveTextContent(
      'Accepted'
    );
  });

  it('applicant status select should be disabled', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const editButton = screen.getAllByTestId('project-form-edit-button')[0];
    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(
      screen.getByTestId('root_response_statusApplicantSees')
    ).toBeDisabled();
  });

  it('applicant status select should be enabled when the correct options are selected', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const editButton = screen.getAllByTestId('project-form-edit-button')[0];
    await act(async () => {
      fireEvent.click(editButton);
    });

    const ministerDecision = screen.getByTestId(
      'root_decision_ministerDecision'
    );

    const applicantResponse = screen.getByTestId(
      'root_response_applicantResponse'
    );

    await act(async () => {
      fireEvent.change(ministerDecision, { target: { value: 'Approved' } });
      fireEvent.change(applicantResponse, { target: { value: 'Accepted' } });
    });

    expect(
      screen.getByTestId('root_response_statusApplicantSees')
    ).not.toBeDisabled();
  });

  it('calls the mutation on form save', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const editButton = screen.getAllByTestId('project-form-edit-button')[0];
    await act(async () => {
      fireEvent.click(editButton);
    });

    const saveButton = screen.getByText('Save');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createConditionalApprovalMutation',

      {
        connections: [expect.anything()],
        input: {
          _applicationId: 1,
          _jsonData: null,
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          conditionalApprovalData: {
            id: 'test-id',
            jsonData: {
              decision: {},
              isedDecisionObj: {},
              letterOfApproval: {},
              response: {},
            },
            rowId: 1,
          },
        },
      });
    });
  });

  it('should show the modal when applicant status select is enabled and json data is saved', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const editButton = screen.getAllByTestId('project-form-edit-button')[0];
    await act(async () => {
      fireEvent.click(editButton);
    });

    const ministerDecision = screen.getByTestId(
      'root_decision_ministerDecision'
    );

    const applicantResponse = screen.getByTestId(
      'root_response_applicantResponse'
    );

    const statusApplicantSees = screen.getByTestId(
      'root_response_statusApplicantSees'
    );

    expect(statusApplicantSees).toBeDisabled();

    await act(async () => {
      fireEvent.change(ministerDecision, { target: { value: 'Approved' } });
      fireEvent.change(applicantResponse, { target: { value: 'Accepted' } });
    });

    expect(statusApplicantSees).not.toBeDisabled();

    await act(async () => {
      fireEvent.change(statusApplicantSees, {
        target: { value: 'Conditionally Approved' },
      });
    });

    const saveButton = screen.getByText('Save');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(screen.getByTestId('old-form-status')).toHaveTextContent('Received');
    expect(screen.getByTestId('new-form-status')).toHaveTextContent(
      'Conditionally Approved'
    );
    expect(
      screen.getByTestId('conditional-approval-modal')
    ).toBeInTheDocument();
    const modalSaveButton = screen.getByText('Yes, change it');

    await act(async () => {
      fireEvent.click(modalSaveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'submitConditionalApprovalMutation',
      {
        input: {
          _applicationId: 1,
          _jsonData: {
            decision: {
              ministerDecision: 'Approved',
            },
            response: {
              applicantResponse: 'Accepted',
              statusApplicantSees: 'Conditionally Approved',
            },
          },
          newApplicationStatus: 'Conditionally Approved',
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          submitConditionallyApproved: {
            conditionalApprovalData: {
              id: 'test-id',
              jsonData: {
                decision: {
                  ministerDecision: 'Approved',
                },
                isedDecisionObj: {},
                letterOfApproval: {},
                response: {
                  applicantResponse: 'Accepted',
                  statusApplicantSees: 'Conditionally Approved',
                },
              },
              rowId: 1,
            },
          },
        },
      });
    });

    expect(
      screen.getAllByTestId('read-only-decision-widget')[0]
    ).toHaveTextContent('Approved');
    expect(
      screen.getAllByTestId('read-only-decision-widget')[1]
    ).toHaveTextContent('No decision received');
    expect(
      screen.getAllByTestId('read-only-response-widget')[0]
    ).toHaveTextContent('Accepted');
  });

  it('should open the editable form when the edit button is clicked', async () => {
    componentTestingHelper.loadQuery(mockJsonDataQueryPayload);
    componentTestingHelper.renderComponent();

    const editButton = screen.getAllByTestId('project-form-edit-button')[0];

    expect(
      screen.queryByTestId('root_response_applicantResponse')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(
      screen.getByTestId('root_response_applicantResponse')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should open the read only form when the cancel button is clicked', async () => {
    componentTestingHelper.loadQuery(mockJsonDataQueryPayload);
    componentTestingHelper.renderComponent();
    const editButton = screen.getByTestId('project-form-edit-button');

    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(editButton).not.toBeInTheDocument();
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(screen.getByTestId('project-form-edit-button')).toBeInTheDocument();
    expect(
      screen.getAllByTestId('read-only-decision-widget')[0]
    ).toHaveTextContent('Approved');
  });

  it('should not save and open the read only form when the modal cancel button is clicked', async () => {
    componentTestingHelper.loadQuery(mockJsonDataQueryPayload);
    componentTestingHelper.renderComponent();

    await act(async () => {
      fireEvent.click(screen.getByTestId('project-form-edit-button'));
    });

    const statusApplicantSees = screen.getByTestId(
      'root_response_statusApplicantSees'
    );

    await act(async () => {
      fireEvent.change(statusApplicantSees, {
        target: { value: 'Conditionally Approved' },
      });
    });

    const saveButton = screen.getByText('Save');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    const modalCancelButton = screen.getByText('No');

    await act(async () => {
      fireEvent.click(modalCancelButton);
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    const modalCLoseButton = screen.getByTestId('close-button');

    await act(async () => {
      fireEvent.click(modalCLoseButton);
    });

    expect(
      screen.getAllByTestId('project-form-edit-button')[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId('read-only-decision-widget')[0]
    ).toHaveTextContent('Approved');
  });
});
