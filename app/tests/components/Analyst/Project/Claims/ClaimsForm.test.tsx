import ClaimsForm from 'components/Analyst/Project/Claims/ClaimsForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';

const testQuery = graphql`
  query ClaimsFormTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    application(id: "TestApplicationId") {
      ...ClaimsForm_application
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationId',
      rowId: 1,
      ccbcNumber: '123456789',
      applicationClaimsDataByApplicationId: {
        edges: [
          {
            node: {
              rowId: 1,
              jsonData: {
                claimsFile: [
                  {
                    id: 1,
                    name: 'claims.xlsx',
                    size: 121479,
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    uuid: '541089ee-8f80-4dd9-844f-093d7739792b',
                  },
                ],
              },
              excelDataId: 1,
              applicationByApplicationId: {
                applicationClaimsExcelDataByApplicationId: {
                  nodes: [
                    {
                      jsonData: {
                        claimNumber: 1,
                        projectNumber: 'CCBC-010001',
                        progressOnPermits: 'Not Started',
                        projectBudgetRisks: 'Yes',
                        dateRequestReceived: '2023-01-01',
                        hasConstructionBegun: 'In Progress',
                        projectScheduleRisks: 'Yes',
                        communicationMaterials: 'Yes',
                        changesToOverallBudget: 'Yes',
                        haveServicesBeenOffered: 'Completed',
                        eligibleCostsIncurredToDate: '2023-08-01T00:00:00.000Z',
                        eligibleCostsIncurredFromDate:
                          '2023-08-02T00:00:00.000Z',
                        thirdPartyPassiveInfrastructure: 'Yes',
                      },
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
    component: ClaimsForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      isExpanded: true,
    }),
  });

describe('The Claims form', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('displays the form', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Claims & progress reports' })
    ).toBeVisible();

    expect(screen.getByText('Add claim')).toBeInTheDocument();
  });

  it('Uploads a Claim and sends notification', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    const addButton = screen.getByText('Add claim').closest('button');

    await act(async () => {
      fireEvent.click(addButton);
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
      'createClaimsDataMutation',
      {
        connections: [expect.anything()],
        input: {
          _jsonData: {
            claimsFile: [
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
          createClaimsData: {
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

  it('can edit a saved Claim', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    const editButton = screen.getByText('Edit').closest('button');

    await act(async () => {
      fireEvent.click(editButton);
    });

    const file = new File([new ArrayBuffer(1)], 'updated.xls', {
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
            fileName: 'updated.xls',
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

    const saveButton = screen.getByRole('button', {
      name: 'Save & Import',
    });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(saveButton);
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createClaimsDataMutation',
      {
        connections: [expect.anything()],
        input: {
          _jsonData: {
            claimsFile: [
              {
                id: 1,
                uuid: 'string',
                name: 'updated.xls',
                size: 1,
                type: 'application/vnd.ms-excel',
              },
            ],
          },
          _applicationId: 1,
          _oldClaimsId: 1,
          _excelDataId: 1,
        },
      }
    );
  });
});
