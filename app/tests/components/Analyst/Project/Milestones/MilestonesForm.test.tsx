import MilestonesForm from 'components/Analyst/Project/Milestones/MilestonesForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';

const testQuery = graphql`
  query MilestonesFormTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    application(id: "TestApplicationId") {
      ...MilestonesForm_application
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationId',
      rowId: 1,
      ccbcNumber: '123456789',
      applicationMilestoneDataByApplicationId: {
        edges: [
          {
            node: {
              rowId: 1,
              jsonData: {
                milestoneFile: [
                  {
                    id: 1,
                    name: 'milestone.xlsx',
                    size: 121479,
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    uuid: '541089ee-8f80-4dd9-844f-093d7739792b',
                  },
                ],
              },
              excelDataId: 1,
              applicationByApplicationId: {
                applicationMilestoneExcelDataByApplicationId: {
                  nodes: [
                    {
                      jsonData: {},
                      rowId: 1,
                    },
                  ],
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
    component: MilestonesForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      isExpanded: true,
    }),
  });

describe('The Milestone form', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('displays the form', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Milestone reports' })
    ).toBeVisible();

    expect(screen.getByText('Add milestone report')).toBeInTheDocument();
  });

  it('Uploads a Milestone', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => ({
          result: {
            data: {
              createApplicationMilestoneExcelData: {
                applicationMilestoneExcelData: {
                  id: 'WyJhcHBsaWNhdGlvbl9taWxlc3RvbmVfZXhjZWxfZGF0YSIsNF0=',
                  rowId: 4,
                  jsonData: {
                    projectNumber: 'CCBC-010001',
                    milestone1Progress: 0.2,
                    milestone2Progress: 0.3,
                    milestone3Progress: 0.2,
                    overallMilestoneProgress: 0.7,
                    milestone1DateOfReception: '2023-01-01T00:00:00.000Z',
                    milestone2DateOfReception: '2023-01-01T00:00:00.000Z',
                  },
                },
                clientMutationId: null,
              },
            },
          },
        }),
      })
    );

    const addButton = screen
      .getByText('Add milestone report')
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

    const inputFile = screen.getAllByTestId('file-test')[0];

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
      'createMilestoneDataMutation',
      {
        connections: [expect.anything()],
        input: {
          _jsonData: {
            dueDate: '2025-07-01',
            milestoneFile: [
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
          _oldMilestoneId: null,
          _excelDataId: 4,
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createApplicationMilestoneExcelData: {
            applicationMilestoneExcelData: {
              id: 'WyJhcHBsaWNhdGlvbl9taWxlc3RvbmVfZXhjZWxfZGF0YSIsNF0=',
              rowId: 4,
              jsonData: {
                projectNumber: 'CCBC-010001',
                milestone1Progress: 0.2,
                milestone2Progress: 0.3,
                milestone3Progress: 0.2,
                overallMilestoneProgress: 0.7,
                milestone1DateOfReception: '2023-01-01T00:00:00.000Z',
                milestone2DateOfReception: '2023-01-01T00:00:00.000Z',
              },
            },
          },
        },
      });
    });

    expect(
      screen.getByText('% Project Milestone Complete')
    ).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Milestone Report')).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith('/api/email/notifyDocumentUpload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.anything(),
    });
  });

  it('can edit a saved Milestone', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    const editButton = screen.getByText('Edit').closest('button');

    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('can delete a saved Milestone', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.queryByText('Milestone Report')).toBeInTheDocument();

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
      'archiveApplicationMilestoneDataMutation',
      {
        input: {
          _milestoneId: 1,
        },
      }
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          archiveApplicationMilestoneData: {
            application: {
              rowId: 1,
            },
          },
        },
      });
    });

    expect(screen.queryByText('Milestone Report')).not.toBeInTheDocument();
  });

  it('can cancel deleting a saved Milestone', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.queryByText('Milestone Report')).toBeInTheDocument();

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

    expect(screen.queryByText('Milestone Report')).toBeInTheDocument();
  });

  it('displays an error message when the excel upload fails', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 400,
        json: () => [
          {
            error:
              'CCBC Number mismatch: expected CCBC-010003, received: CCBC-010001',
          },
        ],
      })
    );

    const addButton = screen
      .getByText('Add milestone report')
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

    const file = new File([new ArrayBuffer(1)], 'milestone.xlsx', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[0];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    expect(
      screen.getByText(
        'An unknown error has occured while validating the milestone.xlsx data'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'CCBC Number mismatch: expected CCBC-010003, received: CCBC-010001'
      )
    ).toBeInTheDocument();
  });
});
