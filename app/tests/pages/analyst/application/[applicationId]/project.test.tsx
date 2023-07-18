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
        amendmentNumbers: '0 1 2 3',
        ccbcNumber: 'CCBC-010003',
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
        amendmentNumbers: '0 1 2 3',
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
            {
              node: {
                id: 'WyJhbm5vdW5jZW1lbnRzIiwxNF1=',
                jsonData: {
                  announcementUrl: 'www.test-3.com',
                  announcementDate: '2023-05-03',
                  announcementType: 'Secondary',
                  previewed: true,
                  preview: {
                    image: '/images/noPreview.png',
                    title: 'Test title',
                    description: 'Test description',
                  },
                },
                rowId: 3,
              },
            },
          ],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          __id: 'client:WyJhcHBsaWNhdGlvbnMiLDZd:__AnnouncementsForm_announcements_connection',
        },
        changeRequestDataByApplicationId: {
          edges: [
            {
              node: {
<<<<<<< HEAD
                id: 'WyJjaGFuZ2VfcmVxdWVzdF9kYXRhIiwxXQ==',
                amendmentNumber: 11,
                createdAt: '2023-07-19T10:09:01.628553-07:00',
                jsonData: {
                  amendmentNumber: 11,
                  isSowUploadError: true,
                  changeRequestFormUpload: [
                    {
                      id: 2,
                      name: 'test.xls',
                      size: 0,
                      type: 'application/vnd.ms-excel',
                      uuid: 'fcd86908-b307-4615-b614-211c4f775d02',
                    },
                  ],
                },
              },
=======
                id: 'WyJjaGFuZ2VfcmVxdWVzdF9kYXRhIiwyXQ==',
                amendmentNumber: 11,
                createdAt: '2023-07-18T14:52:19.490349-07:00',
                jsonData: {
                  dateApproved: '2023-07-01',
                  dateRequested: '2023-07-02',
                  amendmentNumber: 11,
                  levelOfAmendment: 'Major Amendment',
                  updatedMapUpload: [
                    {
                      id: 6,
                      name: 'test.xls',
                      size: 0,
                      type: 'application/vnd.ms-excel',
                      uuid: '370ecddf-de10-44b2-b0b9-22dcbe837a9a',
                    },
                  ],
                  additionalComments: 'additional comments test',
                  descriptionOfChanges: 'description of changes test',
                  statementOfWorkUpload: [
                    {
                      id: 7,
                      name: 'CCBC-010001 - Statement of Work Tables.xlsx',
                      size: 4230870,
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      uuid: '1239e5c2-7e02-44e1-b972-3bb7d0478c00',
                    },
                  ],
                  changeRequestFormUpload: [
                    {
                      id: 5,
                      name: 'change request form file.xls',
                      size: 0,
                      type: 'application/vnd.ms-excel',
                      uuid: '1a9b882c-744b-4663-b5c9-6f46f4568608',
                    },
                  ],
                },
                updatedAt: '2023-07-18T14:52:19.490349-07:00',
                __typename: 'ChangeRequestData',
              },
              cursor: 'WyJhbWVuZG1lbnRfbnVtYmVyX2Rlc2MiLFsxMSwyXV0=',
>>>>>>> b72136f7 (test: add read only change request test)
            },
          ],
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
        projectInformation: {
          jsonData: {
            finalizedMapUpload: [
              {
                id: 10,
                name: 'test.pdf',
                size: 0,
                type: 'application/pdf',
                uuid: '4120e972-d2b3-40f0-a540-e2a57721d962',
              },
            ],
            sowWirelessUpload: [
              {
                id: 12,
                name: 'test.pdf',
                size: 0,
                type: 'application/pdf',
                uuid: '4120e972-d2b3-40f0-a540-e2a57721d962',
              },
            ],
            statementOfWorkUpload: [
              {
                id: 11,
                name: 'CCBC-020118 - Statement of Work Tables - 20230517.xlsx',
                size: 4230881,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                uuid: '3529ee52-c2e0-4c65-b1c2-2e3632e77f66',
              },
            ],
            fundingAgreementUpload: [
              {
                id: 14,
                name: 'test.pdf',
                size: 0,
                type: 'application/pdf',
                uuid: '4120e972-d2b3-40f0-a540-e2a57721d962',
              },
            ],
            dateFundingAgreementSigned: '2023-05-10',
            hasFundingAgreementBeenSigned: true,
          },
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const mockProjectDataQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        rowId: 1,
        amendmentNumbers: '0 1 2 3',
        ccbcNumber: 'CCBC-010003',
        announcements: {
          edges: [],
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
        projectInformation: {
          jsonData: {
            statementOfWorkUpload: [
              {
                id: 11,
                name: 'CCBC-020118 - Statement of Work Tables - 20230517.xlsx',
                size: 4230881,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                uuid: '3529ee52-c2e0-4c65-b1c2-2e3632e77f66',
              },
            ],
            fundingAgreementUpload: [
              {
                id: 10,
                name: 'test.pdf',
                size: 0,
                type: 'application/pdf',
                uuid: '4120e972-d2b3-40f0-a540-e2a57721d962',
              },
            ],
            dateFundingAgreementSigned: '2023-05-10',
            hasFundingAgreementBeenSigned: true,
          },
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const mockSowErrorQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        rowId: 1,
        amendmentNumbers: '0 1 2 3',
        ccbcNumber: 'CCBC-010003',
        projectInformation: {
          jsonData: {
            hasFundingAgreementBeenSigned: true,
            isSowUploadError: true,
          },
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

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

jest.setTimeout(10000000);

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

    const saveButton = screen.getAllByText('Save')[0];

    await act(async () => {
      fireEvent.click(saveButton);
    });

    pageTestingHelper.expectMutationToBeCalled(
      'createConditionalApprovalMutation',

      {
        connections: [
          'client:<Application-mock-id-1>:__ConditionalApprovalForm_conditionalApprovalDataByApplicationId_connection(filter:{"archivedAt":{"isNull":true}},orderBy:"CREATED_AT_DESC")',
        ],
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

    const saveButton = screen.getAllByText('Save')[0];

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

    const modalSaveButton = screen.getAllByText('No')[0];

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
    expect(screen.getByText('May 03, 2023')).toBeInTheDocument();
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
    const announcementDate = screen.getAllByTestId(
      'datepicker-widget-container'
    )[3].children[0].children[0].children[2];

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
          previewed: false,
        },
        projectNumbers: 'CCBC-010001,CCBC-010002',
        oldRowId: 1,
      },
    });
  });

  it('should call the deleteAnnouncement mutation for multi project', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
      pageTestingHelper.renderPage();
    });

    // Click on the delete button to open the form for the first announcement
    const deleteButton = screen.getAllByTestId('project-form-delete-button')[0];
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
        announcementRowId: 1,
        applicationRowId: -1,
        formData: {
          announcementUrl: 'www.test.com',
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
        announcementRowId: 1,
        applicationRowId: -1,
        formData: {
          announcementUrl: 'www.test.com',
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
      },
    });
  });

  it('should call the deleteAnnouncement mutation for single project', async () => {
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
    expect(screen.getByText('Yes, delete')).toBeInTheDocument();
    expect(screen.getByText('No, Cancel')).toBeInTheDocument();

    // delete the announcement
    const deleteFromAll = screen.getByTestId('delete-from-this-btn');
    await act(async () => {
      fireEvent.click(deleteFromAll);
    });

    // Check if the deleteAnnouncement mutation has been sent
    pageTestingHelper.expectMutationToBeCalled('deleteAnnouncementMutation', {
      input: {
        announcementRowId: 2,
        applicationRowId: 1,
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
        applicationRowId: 1,
        formData: {
          announcementUrl: 'www.test-2.com',
          announcementDate: '2023-05-02',
          announcementType: 'Secondary',
        },
      },
    });
  });

  it('should open the project information form and upload a file', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    expect(hasFundingAggreementBeenSigned).not.toBeChecked();

    await act(async () => {
      fireEvent.click(hasFundingAggreementBeenSigned);
    });

    const file = new File([new ArrayBuffer(1)], 'test.pdf', {
      type: 'application/pdf',
    });

    const inputFile = screen.getAllByTestId('file-test')[1];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    pageTestingHelper.expectMutationToBeCalled('createAttachmentMutation', {
      input: {
        attachment: {
          file,
          fileName: 'test.pdf',
          fileSize: '1 Bytes',
          fileType: 'application/pdf',
          applicationId: 1,
        },
      },
    });

    act(() => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 1,
              file: 'string',
            },
          },
        },
      });
    });

    expect(screen.getByText('Replace')).toBeInTheDocument();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('should show the read only project information form', async () => {
    pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
    pageTestingHelper.renderPage();

    expect(screen.getAllByText('SoW')[0]).toBeInTheDocument();

    expect(screen.getAllByText('Map')[0]).toBeInTheDocument();

    expect(screen.getByText('Wireless SoW')).toBeInTheDocument();

    expect(screen.getByText('Funding Agreement')).toBeInTheDocument();

    expect(screen.getByText('May 10, 2023')).toBeInTheDocument();

    expect(
      screen.getByText('View project data in Metabase')
    ).toBeInTheDocument();
  });

  it('should clear and archive the project and sow information on no', async () => {
    pageTestingHelper.loadQuery(mockProjectDataQueryPayload);
    pageTestingHelper.renderPage();

    // Click on the edit button to open the form
    const editButton = screen.getAllByTestId('project-form-edit-button')[3];
    await act(async () => {
      fireEvent.click(editButton);
    });

    const hasFundingAggreementBeenSigned = screen.getByLabelText('No');

    expect(hasFundingAggreementBeenSigned).not.toBeChecked();

    await act(async () => {
      fireEvent.click(hasFundingAggreementBeenSigned);
    });

    const saveButton = screen.getAllByTestId('save')[0];

    await act(async () => {
      fireEvent.click(saveButton);
    });

    pageTestingHelper.expectMutationToBeCalled(
      'archiveApplicationSowMutation',
      {
        input: {
          _amendmentNumber: 0,
        },
      }
    );
  });

  it('calls the mutation on Change Request save', async () => {
    pageTestingHelper.loadQuery(mockProjectDataQueryPayload);
    pageTestingHelper.renderPage();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );
    const addButton = screen.getByText('Add change request').closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const amendmentNumber = screen.getByTestId('root_amendmentNumber');

    await act(async () => {
      fireEvent.change(amendmentNumber, { target: { value: '20' } });
    });

    const file = new File([new ArrayBuffer(1)], 'file.xls', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[1];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    pageTestingHelper.expectMutationToBeCalled('createAttachmentMutation', {
      input: {
        attachment: {
          file,
          fileName: 'file.xls',
          fileSize: '1 Bytes',
          fileType: 'application/vnd.ms-excel',
          applicationId: 1,
        },
      },
    });

    expect(screen.getByLabelText('loading')).toBeInTheDocument();

    act(() => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 1,
              file: 'string',
            },
          },
        },
      });
    });

    expect(screen.getByText('Replace')).toBeInTheDocument();
    expect(screen.getByText('file.xls')).toBeInTheDocument();

    const saveButton = screen.getByRole('button', {
      name: 'Save & Import Data',
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    pageTestingHelper.expectMutationToBeCalled('createChangeRequestMutation', {
      connections: [expect.anything()],
      input: {
        _applicationId: 1,
        _amendmentNumber: 20,
        _jsonData: {
          amendmentNumber: 20,
          statementOfWorkUpload: [
            {
              id: 1,
              uuid: 'string',
              name: 'file.xls',
              size: 1,
              type: 'application/vnd.ms-excel',
            },
          ],
        },
        _oldChangeRequestId: expect.anything(),
      },
    });
  });

  it('should show a spinner when the sow is being imported', async () => {
    pageTestingHelper.loadQuery(mockProjectDataQueryPayload);
    pageTestingHelper.renderPage();

    // Click on the edit button to open the form
    const editButton = screen.getAllByTestId('project-form-edit-button');
    await act(async () => {
      fireEvent.click(editButton[3]);
    });

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    expect(hasFundingAggreementBeenSigned).toBeChecked();

    const saveButton = screen.getByText('Save');

    expect(saveButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(saveButton);
      jest.useFakeTimers();
    });
    expect(
      screen.getByText('Importing Statement of Work. Please wait.')
    ).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    jest.useRealTimers();

    pageTestingHelper.expectMutationToBeCalled(
      'createProjectInformationMutation',
      {
        input: {
          _applicationId: 1,
          _jsonData: expect.anything(),
        },
      }
    );

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createProjectInformation: {
            projectInformationData: { id: '1', jsonData: {}, rowId: 1 },
          },
        },
      });
    });
  });

  it('should stop showing a spinner on error', async () => {
    pageTestingHelper.loadQuery(mockProjectDataQueryPayload);
    pageTestingHelper.renderPage();

    // Click on the edit button to open the form
    const editButton = screen.getAllByTestId('project-form-edit-button');
    await act(async () => {
      fireEvent.click(editButton[3]);
    });

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    expect(hasFundingAggreementBeenSigned).toBeChecked();

    const saveButton = screen.getByText('Save');

    expect(saveButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(saveButton);
      jest.useFakeTimers();
    });
    expect(
      screen.getByText('Importing Statement of Work. Please wait.')
    ).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    jest.useRealTimers();

    pageTestingHelper.expectMutationToBeCalled(
      'createProjectInformationMutation',
      {
        input: {
          _applicationId: 1,
          _jsonData: expect.anything(),
        },
      }
    );

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          nonExistingField: {
            projectInformationData: { id: '1', jsonData: {}, rowId: 1 },
          },
        },
      });
    });

    expect(saveButton).not.toBeDisabled();
  });

  it('should show a spinner on change request', async () => {
    pageTestingHelper.loadQuery(mockProjectDataQueryPayload);
    pageTestingHelper.renderPage();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );
    const addButton = screen.getByText('Add change request').closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const amendmentNumber = screen.getByTestId('root_amendmentNumber');

    await act(async () => {
      fireEvent.change(amendmentNumber, { target: { value: '20' } });
    });

    const file = new File([new ArrayBuffer(1)], 'file.xls', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[1];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    pageTestingHelper.expectMutationToBeCalled('createAttachmentMutation', {
      input: {
        attachment: {
          file,
          fileName: 'file.xls',
          fileSize: '1 Bytes',
          fileType: 'application/vnd.ms-excel',
          applicationId: 1,
        },
      },
    });

    expect(screen.getByLabelText('loading')).toBeInTheDocument();

    act(() => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 1,
              file: 'string',
            },
          },
        },
      });
    });

    const saveButton = screen.getByRole('button', {
      name: 'Save & Import Data',
    });

    await act(async () => {
      fireEvent.click(saveButton);
      jest.useFakeTimers();
    });

    expect(
      screen.getByText('Importing Statement of Work. Please wait.')
    ).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    jest.useRealTimers();

    pageTestingHelper.expectMutationToBeCalled('createChangeRequestMutation', {
      connections: [
        'client:<Application-mock-id-1>:__ChangeRequestForm_changeRequestDataByApplicationId_connection(filter:{"archivedAt":{"isNull":true}},orderBy:"AMENDMENT_NUMBER_DESC")',
      ],
      input: {
        _applicationId: 1,
        _amendmentNumber: 20,
        _jsonData: {
          amendmentNumber: 20,
          statementOfWorkUpload: [
            {
              id: 1,
              uuid: 'string',
              name: 'file.xls',
              size: 1,
              type: 'application/vnd.ms-excel',
            },
          ],
        },
        _oldChangeRequestId: expect.anything(),
      },
    });
  });

  it('should stop showing a spinner on change request error', async () => {
    pageTestingHelper.loadQuery(mockProjectDataQueryPayload);
    pageTestingHelper.renderPage();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );
    const addButton = screen.getByText('Add change request').closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const amendmentNumber = screen.getByTestId('root_amendmentNumber');

    await act(async () => {
      fireEvent.change(amendmentNumber, { target: { value: '20' } });
    });

    const file = new File([new ArrayBuffer(1)], 'file.xls', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[1];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    pageTestingHelper.expectMutationToBeCalled('createAttachmentMutation', {
      input: {
        attachment: {
          file,
          fileName: 'file.xls',
          fileSize: '1 Bytes',
          fileType: 'application/vnd.ms-excel',
          applicationId: 1,
        },
      },
    });

    expect(screen.getByLabelText('loading')).toBeInTheDocument();

    act(() => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 1,
              file: 'string',
            },
          },
        },
      });
    });

    const saveButton = screen.getByRole('button', {
      name: 'Save & Import Data',
    });

    await act(async () => {
      fireEvent.click(saveButton);
      jest.useFakeTimers();
    });

    expect(
      screen.getByText('Importing Statement of Work. Please wait.')
    ).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    jest.useRealTimers();

    pageTestingHelper.expectMutationToBeCalled('createChangeRequestMutation', {
      connections: [
        'client:<Application-mock-id-1>:__ChangeRequestForm_changeRequestDataByApplicationId_connection(filter:{"archivedAt":{"isNull":true}},orderBy:"AMENDMENT_NUMBER_DESC")',
      ],
      input: {
        _applicationId: 1,
        _amendmentNumber: 20,
        _jsonData: {
          amendmentNumber: 20,
          statementOfWorkUpload: [
            {
              id: 1,
              uuid: 'string',
              name: 'file.xls',
              size: 1,
              type: 'application/vnd.ms-excel',
            },
          ],
        },
        _oldChangeRequestId: expect.anything(),
      },
    });

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createChangeRequest: {
            nonExistingField: { id: '1', jsonData: {}, rowId: 1 },
          },
        },
      });
    });
  });

  it('should show the persisted SoW upload error message', async () => {
    pageTestingHelper.loadQuery(mockSowErrorQueryPayload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText('Statement of Work data did not import')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Press the edit pencil to try re-uploading')
    ).toBeInTheDocument();
  });

  it('calls displays the amendment error on save', async () => {
    pageTestingHelper.loadQuery(mockProjectDataQueryPayload);
    pageTestingHelper.renderPage();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    const addButton = screen.getByText('Add change request').closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const amendmentNumber = screen.getByTestId('root_amendmentNumber');

    await act(async () => {
      fireEvent.change(amendmentNumber, { target: { value: 0 } });
    });

    const saveButton = screen.getByText('Save');

    expect(saveButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(
      screen.getByText('Amendment number already in use')
    ).toBeInTheDocument();

    expect(amendmentNumber).toHaveStyle('border: 2px solid #E71F1F;');
  });

  it('should show the read only change request data', async () => {
    pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
    pageTestingHelper.renderPage();

    const viewMoreBtn = screen.getByText('View more');

    await act(async () => {
      fireEvent.click(viewMoreBtn);
    });

    expect(screen.getByText('additional comments test')).toBeInTheDocument();

    expect(screen.getByText('description of changes test')).toBeInTheDocument();

    expect(
      screen.getByText('change request form file.xls')
    ).toBeInTheDocument();

    expect(screen.getByText('Jul 1, 2023')).toBeInTheDocument();

    expect(screen.getByText('Jul 2, 2023')).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
