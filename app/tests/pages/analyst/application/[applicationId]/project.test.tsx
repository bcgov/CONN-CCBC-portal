import { act, fireEvent, screen } from '@testing-library/react';
import * as moduleApi from '@growthbook/growthbook-react';
import { FeatureResult, JSONValue } from '@growthbook/growthbook-react';
import Project from 'pages/analyst/application/[applicationId]/project';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledProjectQuery, {
  projectQuery,
} from '__generated__/projectQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        rowId: 1,
        ccbcNumber: 'CCBC-010003',
        conditionalApproval: {
          id: 'test-id',
          jsonData: null,
        },
        allApplications: {
          nodes: [
            {
              ccbcNumber: 'CCBC-010001',
              rowId: 1,
            },
            {
              ccbcNumber: 'CCBC-010002',
              rowId: 2,
            },
            {
              ccbcNumber: 'CCBC-010003',
              rowId: 3,
            },
          ],
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const mockJsonDataQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        rowId: 1,
        ccbcNumber: 'CCBC-010003',
        announcements: {
          edges: [
            {
              node: {
                id: 'WyJhbm5vdW5jZE1lbnRzIiwrNF2=',
                jsonData: {
                  announcementUrl: 'www.test.com',
                  announcementDate: '2023-05-01',
                  announcementType: 'Primary',
                  otherProjectsInAnnouncement: [
                    { ccbcNumber: 'CCBC-010001' },
                    { ccbcNumber: 'CCBC-010002' },
                  ],
                },
                rowId: 1,
              },
            },
            {
              node: {
                id: 'WyJhbm5vdW5jZW1lbnRzIiwxNF0=',
                jsonData: {
                  announcementUrl: 'www.test-2.com',
                  announcementDate: '2023-05-02',
                  announcementType: 'Secondary',
                },
                rowId: 2,
              },
            },
          ],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          __id: 'client:WyJhcHBsaWNhdGlvbnMiLDZd:__AnnouncementsForm_announcements_connection',
        },
        conditionalApproval: {
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
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        title: null,
        description: 'No preview available',
        image: '/images/noPreview.png',
      }),
  })
) as jest.Mock;

const pageTestingHelper = new PageTestingHelper<projectQuery>({
  pageComponent: Project,
  compiledQuery: compiledProjectQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

const mockShowConditonalApproval: FeatureResult<JSONValue> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_conditional_approval',
};

const mockShowAnnouncement: FeatureResult<JSONValue> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_announcement',
};

describe('The Project page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1' },
    });
    jest.spyOn(moduleApi, 'useFeature').mockImplementation((id) => {
      if (id === 'show_conditional_approval') {
        return mockShowConditonalApproval;
      }
      return mockShowAnnouncement;
    });
    // .mockReturnValue(mockShowConditonalApproval);
  });

  it('displays the title', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', { name: 'Conditional approval' })
    ).toBeInTheDocument();
  });

  it('displays the form titles', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

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

  it('applicant status select should be disabled', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByTestId('root_response_statusApplicantSees')
    ).toBeDisabled();
  });

  it('applicant status select should be enabled when the correct options are selected', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

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
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const saveButton = screen.getByText('Save');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    pageTestingHelper.expectMutationToBeCalled(
      'createConditionalApprovalMutation',
      {
        input: {
          _applicationId: 1,
          _jsonData: {
            decision: {},
            isedDecisionObj: {},
            letterOfApproval: {},
            response: {},
          },
        },
      }
    );

    act(() => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
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
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

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

    const modalSaveButton = screen.getByText('Yes, change it');

    await act(async () => {
      fireEvent.click(modalSaveButton);
    });

    pageTestingHelper.expectMutationToBeCalled(
      'submitConditionalApprovalMutation',
      {
        input: {
          _applicationId: 1,
          _jsonData: {
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
          newApplicationStatus: 'Conditionally Approved',
        },
      }
    );

    act(() => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
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
      });
    });

    expect(
      screen.getAllByTestId('read-only-decision-widget')[0]
    ).toHaveTextContent('Approved');
    expect(
      screen.getAllByTestId('read-only-decision-widget')[1]
    ).toHaveTextContent('No decision received');
    expect(screen.getByTestId('read-only-response-widget')).toHaveTextContent(
      'Accepted'
    );
    expect(screen.getByTestId('read-only-status-widget')).toHaveTextContent(
      'Conditionally Approved'
    );
  });

  it('should open by default the read only form when json data exists', async () => {
    pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('read-only-response-widget')).toHaveTextContent(
      'Accepted'
    );
  });

  it('should open the editable form when the edit button is clicked', async () => {
    pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
    pageTestingHelper.renderPage();

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
    pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
    pageTestingHelper.renderPage();

    const editButton = screen.getAllByTestId('project-form-edit-button')[0];

    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(editButton).not.toBeInTheDocument();
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(
      screen.getAllByTestId('project-form-edit-button')[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId('read-only-decision-widget')[0]
    ).toHaveTextContent('Approved');
  });

  it('should not save and open the read only form when the modal cancel button is clicked', async () => {
    pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
    pageTestingHelper.renderPage();

    await act(async () => {
      fireEvent.click(screen.getAllByTestId('project-form-edit-button')[0]);
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

    const modalSaveButton = screen.getByText('No');

    await act(async () => {
      fireEvent.click(modalSaveButton);
    });

    expect(
      screen.getAllByTestId('project-form-edit-button')[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId('read-only-decision-widget')[0]
    ).toHaveTextContent('Approved');
  });

  it('should show the announcements', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
      pageTestingHelper.renderPage();
    });

    expect(screen.getByText('Primary news release')).toBeInTheDocument();
    expect(screen.getByText('Secondary news releases')).toBeInTheDocument();

    // [VB] commented out until 1397 is done
    // expect(screen.getByText('www.test.com')).toBeInTheDocument();
    // expect(screen.getByText('www.test-2.com')).toBeInTheDocument();

    expect(screen.getByText('May 01, 2023')).toBeInTheDocument();
    expect(screen.getByText('May 02, 2023')).toBeInTheDocument();
  });

  it('should show the error message for invalid url', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const editButton = screen.getByText('Add announcement');

    await act(async () => {
      fireEvent.click(editButton);
    });

    const announcementUrl = screen.getByTestId('root_announcementUrl');

    expect(announcementUrl).toHaveStyle('border: 2px solid #606060;');

    await act(async () => {
      fireEvent.change(announcementUrl, {
        target: { value: 'invalid url' },
      });
    });

    expect(
      screen.getByText('Invalid URL. Please copy and paste from your browser.')
    ).toBeInTheDocument();

    expect(announcementUrl).toHaveStyle('border: 2px solid #E71F1F;');
  });

  it('should highlight the missing form fields', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const editButton = screen.getByText('Add announcement');

    await act(async () => {
      fireEvent.click(editButton);
    });

    const saveButton = screen.getAllByText('Save')[1];

    await act(async () => {
      fireEvent.click(saveButton);
    });

    const announcementUrl = screen.getByTestId('root_announcementUrl');
    const announcementType = screen
      .getByTestId('root_announcementType')
      .closest('div');
    const announcementDate =
      screen.getAllByTestId('datepicker-widget')[3].children[0].children[0]
        .children[0].children[0].children[0];

    expect(announcementUrl).toHaveStyle('border: 2px solid #E71F1F;');
    expect(announcementType).toHaveStyle('border: 2px solid #E71F1F;');
    expect(announcementDate).toHaveStyle('border: 2px solid #E71F1F;');
  });

  it('should send the updateAnnouncement mutation instead of createAnnouncement when updating an existing announcement', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
      pageTestingHelper.renderPage();
    });

    // Click on the edit button to open the form for the first announcement
    const editButton = screen.getAllByTestId('project-form-edit-button')[1];
    await act(async () => {
      fireEvent.click(editButton);
    });

    // Change the announcement URL
    const announcementUrl = screen.getByTestId('root_announcementUrl');
    await act(async () => {
      fireEvent.change(announcementUrl, {
        target: { value: 'https://www.bc.com' },
      });
    });

    // Save the announcement
    const saveButton = screen.getByTestId('save-announcement');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    // Check if the updateAnnouncement mutation has been sent instead of createAnnouncement
    pageTestingHelper.expectMutationToBeCalled('updateAnnouncementMutation', {
      input: {
        jsonData: {
          announcementUrl: 'https://www.bc.com',
          announcementDate: '2023-05-01',
          announcementType: 'Primary',
          otherProjectsInAnnouncement: [
            {
              ccbcNumber: 'CCBC-010001',
            },
            {
              ccbcNumber: 'CCBC-010002',
            },
          ],
        },
        projectNumbers: 'CCBC-010001,CCBC-010002',
        oldRowId: 1,
      },
    });
  });

  it('should call the deleteAnnouncement mutation', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
      pageTestingHelper.renderPage();
    });

    // Click on the delete button to open the form for the first announcement
    const deleteButton = screen.getAllByTestId('project-form-delete-button')[1];
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // observe confirmation dialog
    expect(screen.getByText('Delete from all projects')).toBeInTheDocument();
    expect(screen.getByText('Remove from this project')).toBeInTheDocument();

    // delete the announcement
    const deleteFromAll = screen.getByTestId('delete-from-all-btn');
    await act(async () => {
      fireEvent.click(deleteFromAll);
    });

    // Check if the deleteAnnouncement mutation has been sent
    pageTestingHelper.expectMutationToBeCalled('deleteAnnouncementMutation', {
      input: {
        announcementRowId: 2,
        applicationRowId: -1,
        formData: {
          announcementUrl: 'www.test-2.com',
          announcementDate: '2023-05-02',
          announcementType: 'Secondary',
        },
      },
    });

    // delete the announcement
    const deleteFromThis = screen.getByTestId('delete-from-this-btn');
    await act(async () => {
      fireEvent.click(deleteFromThis);
    });

    // Check if the deleteAnnouncement mutation has been sent
    pageTestingHelper.expectMutationToBeCalled('deleteAnnouncementMutation', {
      input: {
        announcementRowId: 2,
        applicationRowId: -1,
        formData: {
          announcementUrl: 'www.test-2.com',
          announcementDate: '2023-05-02',
          announcementType: 'Secondary',
        },
      },
    });
  });
});
