import CommunityProgressReportForm from 'components/Analyst/Project/CommunityProgressReport/CommunityProgressReportForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';

const testQuery = graphql`
  query CommunityProgressReportFormTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    application(id: "TestApplicationId") {
      ...CommunityProgressReportForm_application
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationId',
      rowId: 1,
      ccbcNumber: '123456789',
      applicationCommunityProgressReportDataByApplicationId: {
        edges: [
          {
            node: {
              rowId: 1,
              jsonData: {
                dueDate: '2023-08-01',
                dateReceived: '2023-08-02',
                progressReportFile: [
                  {
                    id: 1,
                    name: 'community_report.xlsx',
                    size: 121479,
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    uuid: '541089ee-8f80-4dd9-844f-093d7739792b',
                  },
                ],
              },
            },
          },
        ],
      },
    };
  },
  Query() {
    return {
      openIntake: {
        closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<ApplicationFormTestQuery>({
    component: CommunityProgressReportForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      isExpanded: true,
    }),
  });

describe('The Community Progress Report form', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('displays the form', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Community progress reports' })
    ).toBeVisible();

    expect(
      screen.getByText('Add community progress report')
    ).toBeInTheDocument();
  });

  it('Uploads a Community Progress Report and sends a notification', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    const addButton = screen
      .getByText('Add community progress report')
      .closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const dueDateInput = screen.getAllByPlaceholderText('YYYY-MM-DD')[0];

    await act(async () => {
      fireEvent.change(dueDateInput, {
        target: {
          value: '2025-07-01',
        },
      });
    });

    const file = new File([new ArrayBuffer(1)], 'file.xls', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getByTestId('file-test');

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
      name: 'Save & Import',
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createCommunityProgressReportMutation',
      {
        connections: [expect.anything()],
        input: {
          _jsonData: {
            dueDate: '2025-07-01',
            progressReportFile: [
              {
                id: 1,
                uuid: 'string',
                name: 'file.xls',
                size: 1,
                type: 'application/vnd.ms-excel',
              },
            ],
          },
          _applicationId: 1,
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createCommunityProgressReportData: {
            changeRequest: {
              rowId: 1,
            },
          },
        },
      });
    });

    expect(fetch).toHaveBeenCalledWith('/api/email/notifyDocumentUpload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.anything(),
    });
  });

  it('displays the saved Community Progress Report', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('Q2 (Jul-Sep)')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('community_report.xlsx')).toBeInTheDocument();
  });

  it('displays the Metabase link when there is a saved Community Progress Report', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByTestId('metabase-link')).toBeInTheDocument();
  });

  it('should show the community progress report form', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const addCprBtn = screen.getByText('Add community progress report');

    await act(async () => {
      fireEvent.click(addCprBtn);
    });

    expect(
      screen.getByTestId('save-community-progress-report')
    ).toBeInTheDocument();

    expect(screen.getAllByText('Due date')[0]).toBeInTheDocument();

    expect(screen.getByText('Date received')).toBeInTheDocument();

    expect(
      screen.getByText('Upload the community progress report')
    ).toBeInTheDocument();
  });

  it('can edit a saved Community Progress Report', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    const editButton = screen.getByText('Edit').closest('button');

    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('shows spinner when file is being imported and toast on success', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    const addButton = screen
      .getByText('Add community progress report')
      .closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const dueDateInput = screen.getAllByPlaceholderText('YYYY-MM-DD')[0];

    await act(async () => {
      fireEvent.change(dueDateInput, {
        target: {
          value: '2025-07-01',
        },
      });
    });

    const file = new File([new ArrayBuffer(1)], 'file.xls', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getByTestId('file-test');

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

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
      name: 'Save & Import',
    });

    const cancelButton = screen.getByRole('button', {
      name: 'Cancel',
    });

    await act(async () => {
      fireEvent.click(saveButton);
      jest.useFakeTimers();
    });

    expect(
      screen.getByText('Importing community progress report. Please wait.')
    ).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    jest.useRealTimers();

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          applicationCommunityProgressReportData: {
            rowId: 1,
          },
        },
      });
    });

    expect(
      screen.getByText('Community progress report successfully imported')
    ).toBeInTheDocument();
  });

  it('should not show the success toast on validation failure', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    const addButton = screen
      .getByText('Add community progress report')
      .closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const dueDateInput = screen.getAllByPlaceholderText('YYYY-MM-DD')[0];

    await act(async () => {
      fireEvent.change(dueDateInput, {
        target: {
          value: '2025-07-01',
        },
      });
    });

    const file = new File([new ArrayBuffer(1)], 'file.xls', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getByTestId('file-test');

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

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

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 400, json: () => {} })
    );

    expect(screen.getByText('Replace')).toBeInTheDocument();
    expect(screen.getByText('file.xls')).toBeInTheDocument();

    const saveButton = screen.getByRole('button', {
      name: 'Save & Import',
    });

    const cancelButton = screen.getByRole('button', {
      name: 'Cancel',
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(
      screen.getByText('Importing community progress report. Please wait.')
    ).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          applicationCommunityProgressReportData: {
            rowId: 1,
          },
        },
      });
    });

    const toast = screen.queryByText(
      'Community progress report successfully imported'
    );

    expect(toast).toBeNull();
  });

  it('can delete a saved Community Progress Report', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.queryByText('community_report.xlsx')).toBeInTheDocument();

    const deleteButton = screen.getByText('Delete').closest('button');

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(screen.getByText('Yes, delete')).toBeVisible();
    expect(screen.getByText('No, keep')).toBeVisible();

    const deleteConfirm = screen.getByText('Yes, delete').closest('button');

    await act(async () => {
      fireEvent.click(deleteConfirm);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'archiveApplicationCommunityProgressReportMutation',
      {
        input: {
          _communityProgressReportId: 1,
        },
      }
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          archiveApplicationCommunityProgressReportData: {
            application: {
              rowId: 1,
            },
          },
        },
      });
    });

    expect(screen.queryByText('community_report.xlsx')).not.toBeInTheDocument();
  });

  it('can cancel deleting a saved Community Progress Report', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.queryByText('community_report.xlsx')).toBeInTheDocument();

    const deleteButton = screen.getByText('Delete').closest('button');

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(screen.getByText('Yes, delete')).toBeVisible();
    expect(screen.getByText('No, keep')).toBeVisible();

    const deleteConfirm = screen.getByText('No, keep').closest('button');

    await act(async () => {
      fireEvent.click(deleteConfirm);
    });

    expect(screen.queryByText('community_report.xlsx')).toBeInTheDocument();
  });

  it('shows the fiscal date warning when selecting a due date in the same fiscal quarter as an existing report', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const addButton = screen
      .getByText('Add community progress report')
      .closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const dueDateInput = screen.getAllByPlaceholderText('YYYY-MM-DD')[0];

    await act(async () => {
      fireEvent.change(dueDateInput, {
        target: {
          value: '2023-08-01',
        },
      });
    });

    expect(
      screen.getByText(
        'A community progress report has already been created for this quarter'
      )
    ).toBeInTheDocument();
  });

  it('should call the community progress report create mutation', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const addCprBtn = screen.getByText('Add community progress report');

    await act(async () => {
      fireEvent.click(addCprBtn);
    });

    const dueDateInput = screen.getAllByPlaceholderText('YYYY-MM-DD')[0];

    await act(async () => {
      fireEvent.change(dueDateInput, {
        target: {
          value: '2023-08-01',
        },
      });
    });

    const saveButton = screen.getByTestId('save-community-progress-report');

    expect(saveButton).toBeInTheDocument();

    expect(screen.getAllByText('Due date')[0]).toBeInTheDocument();

    expect(screen.getByText('Date received')).toBeInTheDocument();

    expect(
      screen.getByText('Upload the community progress report')
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createCommunityProgressReportMutation',
      {
        connections: [expect.anything()],
        input: {
          _jsonData: {
            dueDate: '2023-08-01',
          },
          _applicationId: 1,
        },
      }
    );
  });
});
