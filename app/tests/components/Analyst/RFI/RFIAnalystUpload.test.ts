import { act, fireEvent, screen } from '@testing-library/react';
import { graphql } from 'react-relay';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';
import RFIAnalystUpload from 'components/Analyst/RFI/RFIAnalystUpload';
import compiledQuery, {
  RFIAnalystUploadTestQuery,
} from '__generated__/RFIAnalystUploadTestQuery.graphql';
import useHHCountUpdateEmail from 'lib/helpers/useHHCountUpdateEmail';
import useRfiCoverageMapKmzUploadedEmail from 'lib/helpers/useRfiCoverageMapKmzUploadedEmail';
import { mocked } from 'jest-mock';

jest.mock('lib/helpers/useHHCountUpdateEmail');
jest.mock('lib/helpers/useRfiCoverageMapKmzUploadedEmail');

const mockNotifyHHCountUpdate = jest.fn();
mocked(useHHCountUpdateEmail).mockReturnValue({
  notifyHHCountUpdate: mockNotifyHHCountUpdate,
});

const mockNotifyRfiCoverageMapKmzUploaded = jest.fn();
mocked(useRfiCoverageMapKmzUploadedEmail).mockReturnValue({
  notifyRfiCoverageMapKmzUploaded: mockNotifyRfiCoverageMapKmzUploaded,
});

const testQuery = graphql`
  query RFIAnalystUploadTestQuery($rowId: Int!, $rfiId: Int!)
  @relay_test_operation {
    ...RFIAnalystUpload_query
  }
`;

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        rowId: 1,
        ccbcNumber: 'CCBC-12345',
        formData: {
          formSchemaId: 1,
          jsonData: {
            benefits: {
              householdsImpactedIndigenous: 13,
              numberOfHouseholds: 12,
            },
          },
        },
      },
      rfiDataByRowId: {
        rowId: 1,
        rfiNumber: 'RFI-01',
        jsonData: {
          rfiAdditionalFiles: {
            detailedBudgetRfi: true,
            eligibilityAndImpactsCalculatorRfi: true,
            geographicCoverageMapRfi: true,
            geographicCoverageMap: [
              {
                uuid: 1,
                name: '1.kmz',
                size: 0,
                type: '',
                uploadedAt: '2024-05-31T14:05:03.509-07:00',
              },
              {
                uuid: 2,
                name: '2.kmz',
                size: 0,
                type: '',
                uploadedAt: '2024-05-31T14:05:03.509-07:00',
              },
            ],
          },
        },
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<RFIAnalystUploadTestQuery>({
    component: RFIAnalystUpload,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      query: data,
    }),
  });

describe('The RFIAnalystUpload component', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('should render the requested fields', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByRole('heading', {
        name: 'Template 1 - Eligibility and Impacts Calculator',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Template 2 - Detailed Budget',
      })
    ).toBeInTheDocument();
  });

  it('should render upload indication for template 1 and 2', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByText(
        /RFI upload for Template 1 automatically updates the data for Final Eligible Households and Indigenous/
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /FI upload for Template 2 automatically updates the data for Total Eligible Costs and Total Project Costs/
      )
    ).toBeInTheDocument();
  });

  it('should render the upload button', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getAllByRole('button', {
        name: 'Upload(s) Drop files (or click to upload)',
      })[0]
    ).toBeInTheDocument();
  });

  it('should render the save button', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByRole('button', {
        name: 'Save',
      })
    ).toBeInTheDocument();
  });

  it('should call the createNewFormDataMutation and email notification on excel upload', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            result: {
              finalEligibleHouseholds: 2,
              totalNumberHouseholdsImpacted: 123987,
            },
          }),
      })
    );

    const dateInput = screen.getAllByPlaceholderText('YYYY-MM-DD')[0];

    await act(async () => {
      fireEvent.change(dateInput, {
        target: {
          value: '2025-07-01',
        },
      });
    });

    const file = new File([new ArrayBuffer(1)], 'template_one.xlsx', {
      type: 'application/excel',
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
            fileName: 'template_one.xlsx',
            fileSize: '1 Bytes',
            fileType: 'application/excel',
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

    expect(screen.getByText('template_one.xlsx')).toBeInTheDocument();

    expect(screen.getByText(/Template 1 validation successful/)).toBeVisible();

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'updateWithTrackingRfiMutation',
      {
        input: {
          jsonData: {
            rfiType: [],
            rfiAdditionalFiles: {
              detailedBudgetRfi: true,
              eligibilityAndImpactsCalculatorRfi: true,
              eligibilityAndImpactsCalculator: expect.anything(),
              geographicCoverageMapRfi: true,
              geographicCoverageMap: [
                {
                  uuid: 1,
                  name: '1.kmz',
                  size: 0,
                  type: '',
                  uploadedAt: '2024-05-31T14:05:03.509-07:00',
                },
                {
                  uuid: 2,
                  name: '2.kmz',
                  size: 0,
                  type: '',
                  uploadedAt: '2024-05-31T14:05:03.509-07:00',
                },
              ],
            },
          },
          rfiRowId: 1,
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          updateWithTrackingRfi: {
            rfiData: {
              rowId: 1,
              jsonData: {
                rfiAdditionalFiles: {
                  detailedBudgetRfi: true,
                  eligibilityAndImpactsCalculatorRfi: true,
                  eligibilityAndImpactsCalculator: expect.anything(),
                  geographicCoverageMapRfi: true,
                  geographicCoverageMap: [
                    {
                      uuid: 1,
                      name: '1.kmz',
                      size: 0,
                      type: '',
                      uploadedAt: '2024-05-31T14:05:03.509-07:00',
                    },
                    {
                      uuid: 2,
                      name: '2.kmz',
                      size: 0,
                      type: '',
                      uploadedAt: '2024-05-31T14:05:03.509-07:00',
                    },
                  ],
                },
              },
            },
          },
        },
      });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createNewFormDataMutation',
      {
        input: {
          applicationRowId: 1,
          jsonData: {
            benefits: {
              householdsImpactedIndigenous: 123987,
              numberOfHouseholds: 2,
            },
          },
          reasonForChange:
            'Auto updated from upload of Template 1 for RFI: RFI-01',
          formSchemaId: 1,
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {},
      });
    });

    expect(mockNotifyHHCountUpdate).toHaveBeenCalledWith(
      {
        householdsImpactedIndigenous: 123987,
        numberOfHouseholds: 2,
      },
      { householdsImpactedIndigenous: 13, numberOfHouseholds: 12 },
      1,
      {
        ccbcNumber: 'CCBC-12345',
        manualUpdate: false,
        rfiNumber: 'RFI-01',
        timestamp: expect.any(String),
      }
    );

    expect(mockNotifyRfiCoverageMapKmzUploaded).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(/Template 1 data changed successfully/)
    ).toBeVisible();
  });

  it('should render success toast for template two when upload successful', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            result: {
              totalEligibleCosts: 92455,
              totalProjectCosts: 101230,
            },
          }),
      })
    );

    const dateInput = screen.getAllByPlaceholderText('YYYY-MM-DD')[0];

    await act(async () => {
      fireEvent.change(dateInput, {
        target: {
          value: '2025-07-01',
        },
      });
    });

    const file = new File([new ArrayBuffer(1)], 'template_two.xlsx', {
      type: 'application/excel',
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
            file: expect.anything(),
            fileName: 'template_two.xlsx',
            fileSize: '1 Bytes',
            fileType: 'application/excel',
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

    expect(screen.getByText('template_two.xlsx')).toBeInTheDocument();

    expect(screen.getByText(/Template 2 validation successful/)).toBeVisible();

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'updateWithTrackingRfiMutation',
      {
        input: {
          jsonData: {
            rfiType: [],
            rfiAdditionalFiles: {
              detailedBudgetRfi: true,
              eligibilityAndImpactsCalculatorRfi: true,
              detailedBudget: expect.anything(),
              geographicCoverageMapRfi: true,
              geographicCoverageMap: expect.anything(),
            },
          },
          rfiRowId: 1,
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          updateWithTrackingRfi: {
            rfiData: {
              rowId: 1,
              jsonData: {
                rfiAdditionalFiles: {
                  detailedBudgetRfi: true,
                  eligibilityAndImpactsCalculatorRfi: true,
                  detailedBudget: expect.anything(),
                  geographicCoverageMapRfi: true,
                  geographicCoverageMap: expect.anything(),
                },
              },
            },
          },
        },
      });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createNewFormDataMutation',
      {
        input: {
          applicationRowId: 1,
          jsonData: {
            benefits: {
              householdsImpactedIndigenous: 13,
              numberOfHouseholds: 12,
            },
            budgetDetails: {
              totalEligibleCosts: 92455,
              totalProjectCost: 101230,
            },
          },
          reasonForChange:
            'Auto updated from upload of Template 2 for RFI: RFI-01',
          formSchemaId: 1,
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {},
      });
    });

    expect(
      screen.getByText(/Template 2 data changed successfully/)
    ).toBeVisible();
  });
});
