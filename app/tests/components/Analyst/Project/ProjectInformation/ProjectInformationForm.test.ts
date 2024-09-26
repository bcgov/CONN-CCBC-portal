import ProjectInformationForm from 'components/Analyst/Project/ProjectInformation/ProjectInformationForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';

const testQuery = graphql`
  query ProjectInformationFormTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    application(id: "TestApplicationId") {
      ...ProjectInformationForm_application
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationId',
      rowId: 1,
      ccbcNumber: '123456789',
    };
  },
};

const mockDataQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationId',
      rowId: 1,
      ccbcNumber: '123456789',
      amendmentNumbers: '0 1 2 3',
      changeRequestDataByApplicationId: {
        edges: [
          {
            node: {
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
          },
        ],
      },
      projectInformation: {
        jsonData: {
          finalizedMapUpload: [
            {
              id: 10,
              name: 'test1.kmz',
              size: 0,
              type: 'application/pdf',
              uuid: '4120e972-d2b3-40f0-a540-e2a57721d962',
            },
            {
              id: 10,
              name: 'test2.kmz',
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
          otherFiles: [
            {
              id: 10,
              name: 'otherImage.png',
              size: 527870,
              type: 'image/png',
              uuid: '192eeda2-e6fa-41e6-9980-25d048eb5717',
              uploadedAt: '2024-04-08T10:45:03.324-07:00',
            },
          ],
          dateFundingAgreementSigned: '2023-05-10',
          hasFundingAgreementBeenSigned: true,
        },
      },
    };
  },
};

const mockSowErrorQueryPayload = {
  Application() {
    return {
      rowId: 1,
      amendmentNumbers: '0 1 2 3',
      ccbcNumber: 'CCBC-010003',
      projectInformation: {
        jsonData: {
          hasFundingAgreementBeenSigned: true,
          isSowUploadError: true,
        },
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<ApplicationFormTestQuery>({
    component: ProjectInformationForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      isExpanded: true,
    }),
  });

describe('The ProjectInformation form', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('displays the form', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByRole('heading', {
        name: 'Funding agreement, statement of work, & map',
      })
    ).toBeVisible();
  });

  it('should open the project information form and upload a file', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    expect(hasFundingAggreementBeenSigned).not.toBeChecked();

    await act(async () => {
      fireEvent.click(hasFundingAggreementBeenSigned);
    });

    const file = new File([new ArrayBuffer(1)], 'test.pdf', {
      type: 'application/pdf',
    });

    const inputFile = screen.getAllByTestId('file-test')[0];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createAttachmentMutation',
      {
        input: {
          attachment: {
            file: expect.anything(),
            fileName: 'test.pdf',
            fileSize: '1 Bytes',
            fileType: 'application/pdf',
            applicationId: expect.anything(),
          },
        },
      }
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
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

  it('should clear and archive the project and sow information on no', async () => {
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

    // Click on the edit button to open the form
    const editButton = screen.getAllByTestId('project-form-edit-button')[2];
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

    componentTestingHelper.expectMutationToBeCalled(
      'archiveApplicationSowMutation',
      {
        input: {
          _amendmentNumber: 0,
        },
      }
    );
  });

  it('should show the read only project information form', async () => {
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

    expect(screen.getAllByText('SoW')[0]).toBeInTheDocument();

    expect(screen.getAllByText('test1.kmz')[0]).toBeInTheDocument();
    expect(screen.getAllByText('test2.kmz')[0]).toBeInTheDocument();

    expect(screen.getByText('Wireless SoW')).toBeInTheDocument();

    expect(screen.getByText('Funding Agreement')).toBeInTheDocument();

    expect(screen.getByText('May 10, 2023')).toBeInTheDocument();

    expect(
      screen.getByText('View project data in Metabase')
    ).toBeInTheDocument();
  });

  it('calls the mutation on Change Request save and send email notification for SOW upload', async () => {
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

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

    componentTestingHelper.expectMutationToBeCalled(
      'createAttachmentMutation',
      {
        input: {
          attachment: {
            file,
            fileName: 'file.xls',
            fileSize: '1 Bytes',
            fileType: 'application/vnd.ms-excel',
            applicationId: 1,
          },
        },
      }
    );

    expect(screen.getByLabelText('loading')).toBeInTheDocument();

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
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

    componentTestingHelper.expectMutationToBeCalled(
      'createChangeRequestMutation',
      {
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
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createChangeRequest: {
            changeRequest: {
              rowId: 1,
            },
          },
        },
      });
    });

    expect(
      screen.getByText('Statement of work successfully imported')
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith('/api/email/notifySowUpload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.anything(),
    });
  });

  it('should show a spinner when the sow is being imported', async () => {
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    // Click on the edit button to open the form
    const editButton = screen.getAllByTestId('project-form-edit-button');
    await act(async () => {
      fireEvent.click(editButton[3]);
    });

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    expect(hasFundingAggreementBeenSigned).toBeChecked();

    const file = new File([new ArrayBuffer(1)], 'file.xls', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getAllByTestId('file-test');

    await act(async () => {
      fireEvent.change(inputFile[1], { target: { files: [file] } });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createAttachmentMutation',
      {
        input: {
          attachment: {
            file,
            fileName: 'file.xls',
            fileSize: '1 Bytes',
            fileType: 'application/vnd.ms-excel',
            applicationId: 1,
          },
        },
      }
    );

    expect(screen.getByLabelText('loading')).toBeInTheDocument();

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
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

    const saveButton = screen.getByText('Save & Import Data');

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

    componentTestingHelper.expectMutationToBeCalled(
      'createProjectInformationMutation',
      {
        input: {
          _applicationId: 1,
          _jsonData: expect.anything(),
        },
      }
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createProjectInformation: {
            projectInformationData: { id: '1', jsonData: {}, rowId: 1 },
          },
        },
      });
    });
  });

  it('should stop showing a spinner on error', async () => {
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    // Click on the edit button to open the form
    const editButton = screen.getAllByTestId('project-form-edit-button');
    await act(async () => {
      fireEvent.click(editButton[3]);
    });

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    expect(hasFundingAggreementBeenSigned).toBeChecked();

    const file = new File([new ArrayBuffer(1)], 'file.xls', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getAllByTestId('file-test');

    await act(async () => {
      fireEvent.change(inputFile[1], { target: { files: [file] } });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createAttachmentMutation',
      {
        input: {
          attachment: {
            file,
            fileName: 'file.xls',
            fileSize: '1 Bytes',
            fileType: 'application/vnd.ms-excel',
            applicationId: 1,
          },
        },
      }
    );

    expect(screen.getByLabelText('loading')).toBeInTheDocument();

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
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

    const saveButton = screen.getByText('Save & Import Data');

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

    componentTestingHelper.expectMutationToBeCalled(
      'createProjectInformationMutation',
      {
        input: {
          _applicationId: 1,
          _jsonData: expect.anything(),
        },
      }
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          nonExistingField: {
            projectInformationData: { id: '1', jsonData: {}, rowId: 1 },
          },
        },
      });
    });

    expect(saveButton).not.toBeDisabled();
  });

  it('does not show the toast after saving if change request sow validation has failed', async () => {
    const mockErrorList = [
      { level: 'summary', error: 'Error 1', filename: 'test.txt' },
      { level: 'tab', error: 'Error 2', filename: 'test.txt' },
    ];
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 400, json: () => mockErrorList })
    );
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

    const addButton = screen.getByText('Add change request').closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const amendmentNumber = screen.getByTestId('root_amendmentNumber');

    await act(async () => {
      fireEvent.change(amendmentNumber, { target: { value: '20' } });
    });
    const file = new File([new ArrayBuffer(1)], 'file.xlsx', {
      type: 'application/excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[1];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    expect(
      screen.getByText(
        'Statement of Work import failed, please check the file and try again'
      )
    ).toBeInTheDocument();

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });

    await act(async () => {
      fireEvent.click(saveButton);
      jest.useFakeTimers();
    });

    expect(saveButton).toBeDisabled();

    jest.useRealTimers();

    componentTestingHelper.expectMutationToBeCalled(
      'createChangeRequestMutation',
      expect.anything()
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: expect.anything(),
      });
    });

    expect(
      screen.queryByText('Statement of work successfully imported')
    ).toBeNull();
  });

  it('does not show the toast after saving if sow validation has failed', async () => {
    const mockErrorList = [
      { level: 'summary', error: 'Error 1', filename: 'test.txt' },
      { level: 'tab', error: 'Error 2', filename: 'test.txt' },
    ];
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 400, json: () => mockErrorList })
    );
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

    // Click on the edit button to open the form
    const editButton = screen.getAllByTestId('project-form-edit-button');
    await act(async () => {
      fireEvent.click(editButton[3]);
    });

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    await act(async () => {
      fireEvent.click(hasFundingAggreementBeenSigned);
    });

    const file = new File([new ArrayBuffer(1)], 'file.xlsx', {
      type: 'application/excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[1];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    const date = screen.getAllByTestId('datepicker-widget-input')[0];

    await act(async () => {
      fireEvent.change(date, { target: { value: '2023-01-01' } });
    });

    expect(
      screen.getByText(
        'Statement of Work import failed, please check the file and try again'
      )
    ).toBeInTheDocument();

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });

    await act(async () => {
      fireEvent.click(saveButton);
      jest.useFakeTimers();
    });

    expect(saveButton).toBeDisabled();

    jest.useRealTimers();

    componentTestingHelper.expectMutationToBeCalled(
      'createProjectInformationMutation',
      expect.anything()
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: expect.anything(),
      });
    });

    expect(
      screen.queryByText('Statement of work successfully imported')
    ).toBeNull();
  });

  it('should show a spinner on change request', async () => {
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

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

    componentTestingHelper.expectMutationToBeCalled(
      'createAttachmentMutation',
      {
        input: {
          attachment: {
            file,
            fileName: 'file.xls',
            fileSize: '1 Bytes',
            fileType: 'application/vnd.ms-excel',
            applicationId: 1,
          },
        },
      }
    );

    expect(screen.getByLabelText('loading')).toBeInTheDocument();

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
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

    componentTestingHelper.expectMutationToBeCalled(
      'createChangeRequestMutation',
      {
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
      }
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createChangeRequest: {
            changeRequestData: {
              id: '1',
              jsonData: {},
              rowId: 1,
            },
          },
        },
      });
    });

    expect(
      screen.getByText('Statement of work successfully imported')
    ).toBeInTheDocument();
  });

  it('should stop showing a spinner on change request error', async () => {
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

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

    componentTestingHelper.expectMutationToBeCalled(
      'createAttachmentMutation',
      {
        input: {
          attachment: {
            file,
            fileName: 'file.xls',
            fileSize: '1 Bytes',
            fileType: 'application/vnd.ms-excel',
            applicationId: 1,
          },
        },
      }
    );

    expect(screen.getByLabelText('loading')).toBeInTheDocument();

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
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

    componentTestingHelper.expectMutationToBeCalled(
      'createChangeRequestMutation',
      {
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
      }
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createChangeRequest: {
            nonExistingField: { id: '1', jsonData: {}, rowId: 1 },
          },
        },
      });
    });
  });

  it('should show the persisted SoW upload error message', async () => {
    componentTestingHelper.loadQuery(mockSowErrorQueryPayload);
    componentTestingHelper.renderComponent();

    expect(
      screen.getByText('Statement of Work data did not import')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Press the edit pencil to try re-uploading')
    ).toBeInTheDocument();
  });

  it('calls displays the amendment error on save', async () => {
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

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
    componentTestingHelper.loadQuery(mockDataQueryPayload);
    componentTestingHelper.renderComponent();

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
