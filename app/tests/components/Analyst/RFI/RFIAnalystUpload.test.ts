import { act, fireEvent, screen } from '@testing-library/react';
import { graphql } from 'react-relay';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';
import RFIAnalystUpload from 'components/Analyst/RFI/RFIAnalystUpload';
import compiledQuery, {
  RFIAnalystUploadTestQuery,
} from '__generated__/RFIAnalystUploadTestQuery.graphql';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import useRfiCoverageMapKmzUploadedEmail from 'lib/helpers/useRfiCoverageMapKmzUploadedEmail';
import { mocked } from 'jest-mock';
import { useRouter } from 'next/router';

jest.mock('lib/helpers/useEmailNotification');
jest.mock('lib/helpers/useRfiCoverageMapKmzUploadedEmail');

const mockNotifyHHCountUpdate = jest.fn();
const mockNotifyDocumentUpload = jest.fn();
mocked(useEmailNotification).mockReturnValue({
  notifyHHCountUpdate: mockNotifyHHCountUpdate,
  notifyDocumentUpload: mockNotifyDocumentUpload,
});

const mockNotifyRfiCoverageMapKmzUploaded = jest.fn();
mocked(useRfiCoverageMapKmzUploadedEmail).mockReturnValue({
  notifyRfiCoverageMapKmzUploaded: mockNotifyRfiCoverageMapKmzUploaded,
});

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const routerPush = jest.fn();

mocked(useRouter).mockReturnValue({
  push: routerPush,
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
  pathname: '/',
  route: '/',
  query: {
    applicationId: '123',
    rfiId: '920',
  },
} as any);

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
            geographicNamesRfi: true,
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

    expect(
      screen.getByRole('heading', {
        name: 'Template 9 - Backbone and Geographic Names',
      })
    ).toBeInTheDocument();
  });

  it('should render upload indication for template 1 and 2', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByText(
        /RFI upload for Template 1 automatically updates the data for Final Eligible Households and Indigenous Households/
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
      'updateRfiAndFormDataMutation',
      {
        rfiInput: {
          jsonData: {
            rfiType: [],
            rfiAdditionalFiles: {
              detailedBudgetRfi: true,
              eligibilityAndImpactsCalculatorRfi: true,
              eligibilityAndImpactsCalculator: expect.anything(),
              geographicCoverageMapRfi: true,
              geographicNamesRfi: true,
              geographicCoverageMap: expect.anything(),
            },
          },
          rfiRowId: 1,
        },
        formInput: {
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

    await act(async () => {
      act(() => {
        componentTestingHelper.environment.mock.resolveMostRecentOperation({
          data: {
            updateRfi: {
              rfiData: {
                rowId: 1,
                jsonData: {
                  rfiAdditionalFiles: {
                    detailedBudgetRfi: true,
                    eligibilityAndImpactsCalculatorRfi: true,
                    geographicNamesRfi: true,
                    detailedBudget: expect.anything(),
                    geographicCoverageMapRfi: true,
                    geographicCoverageMap: expect.anything(),
                  },
                },
              },
            },
            createNewFormData: {
              formData: {
                rowId: 1,
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
              },
            },
          },
        });
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

    expect(mockNotifyDocumentUpload).toHaveBeenCalledWith(1, {
      ccbcNumber: 'CCBC-12345',
      documentType: 'Template 1',
      documentNames: ['template_one.xlsx'],
    });

    expect(
      screen.getByText(/Template 1 data changed successfully/)
    ).toBeVisible();
  });

  it('should render success toast for template 2 when upload successful', async () => {
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
      'updateRfiAndFormDataMutation',
      {
        rfiInput: {
          jsonData: {
            rfiType: [],
            rfiAdditionalFiles: {
              detailedBudgetRfi: true,
              eligibilityAndImpactsCalculatorRfi: true,
              detailedBudget: expect.anything(),
              geographicNamesRfi: true,
              geographicCoverageMapRfi: true,
              geographicCoverageMap: expect.anything(),
            },
          },
          rfiRowId: 1,
        },
        formInput: {
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
        data: {
          updateRfi: {},
          createNewFormData: {},
        },
      });
    });

    expect(
      screen.getByText(/Template 2 data changed successfully/)
    ).toBeVisible();
  });

  it('should save template nine data and render success toast for template nine when upload successful', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            communitiesToBeServed: 3,
            indigenousCommunitiesToBeServed: 1,
            totalNumberOfHouseholds: 39,
            totalNumberOfIndigenousHouseholds: 2,
            geoNames: [
              {
                projectZone: 9,
                geoName: 'Cranbrook',
                type: 'City',
                mapLink: 'https://apps.gov.bc.ca/pub/bcgnws/names/4786.html',
                isIndigenous: 'N',
                geoNameId: 4786,
                regionalDistrict: 'Regional District of East Kootenay',
                economicRegion: 'Kootenay',
                pointOfPresenceId: 'Mission Road Site',
                proposedSolution: 'Fibre-Optic',
                households: 18,
              },
              {
                projectZone: 9,
                geoName: 'Kimberley',
                type: 'City',
                mapLink: 'https://apps.gov.bc.ca/pub/bcgnws/names/3865.html',
                isIndigenous: 'N',
                geoNameId: 3865,
                regionalDistrict: 'Regional District of East Kootenay',
                economicRegion: 'Kootenay',
                pointOfPresenceId: 'Mission Road Site',
                proposedSolution: 'Fibre-Optic',
                households: 19,
              },
              {
                projectZone: 9,
                geoName: "Saint Mary's 1A",
                type: 'Indian Reserve',
                mapLink: 'https://apps.gov.bc.ca/pub/bcgnws/names/65172.html',
                isIndigenous: 'Y',
                geoNameId: 65172,
                regionalDistrict: 'Regional District of East Kootenay',
                economicRegion: 'Kootenay',
                pointOfPresenceId: 'Mission Road Site',
                proposedSolution: 'Fibre-Optic',
                households: 2,
              },
            ],
            originalFileName: 'template_nine.xlsx',
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

    const file = new File([new ArrayBuffer(1)], 'template_nine.xlsx', {
      type: 'application/excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[2];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createAttachmentMutation',
      {
        input: {
          attachment: {
            file: expect.anything(),
            fileName: 'template_nine.xlsx',
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

    expect(screen.getByText('template_nine.xlsx')).toBeInTheDocument();

    expect(screen.getByText(/Template 9 processing successful/)).toBeVisible();

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'updateRfiAndCreateTemplateNineDataMutation',
      {
        rfiInput: {
          jsonData: {
            rfiType: [],
            rfiAdditionalFiles: {
              detailedBudgetRfi: true,
              eligibilityAndImpactsCalculatorRfi: true,
              geographicCoverageMapRfi: true,
              geographicNamesRfi: true,
              geographicCoverageMap: expect.anything(),
              geographicNames: expect.anything(),
            },
          },
          rfiRowId: 1,
        },
        templateNineInput: {
          _applicationId: 1,
          _jsonData: {
            communitiesToBeServed: 3,
            indigenousCommunitiesToBeServed: 1,
            totalNumberOfHouseholds: 39,
            totalNumberOfIndigenousHouseholds: 2,
            geoNames: [
              {
                projectZone: 9,
                geoName: 'Cranbrook',
                type: 'City',
                mapLink: 'https://apps.gov.bc.ca/pub/bcgnws/names/4786.html',
                isIndigenous: 'N',
                geoNameId: 4786,
                regionalDistrict: 'Regional District of East Kootenay',
                economicRegion: 'Kootenay',
                pointOfPresenceId: 'Mission Road Site',
                proposedSolution: 'Fibre-Optic',
                households: 18,
              },
              {
                projectZone: 9,
                geoName: 'Kimberley',
                type: 'City',
                mapLink: 'https://apps.gov.bc.ca/pub/bcgnws/names/3865.html',
                isIndigenous: 'N',
                geoNameId: 3865,
                regionalDistrict: 'Regional District of East Kootenay',
                economicRegion: 'Kootenay',
                pointOfPresenceId: 'Mission Road Site',
                proposedSolution: 'Fibre-Optic',
                households: 19,
              },
              {
                projectZone: 9,
                geoName: "Saint Mary's 1A",
                type: 'Indian Reserve',
                mapLink: 'https://apps.gov.bc.ca/pub/bcgnws/names/65172.html',
                isIndigenous: 'Y',
                geoNameId: 65172,
                regionalDistrict: 'Regional District of East Kootenay',
                economicRegion: 'Kootenay',
                pointOfPresenceId: 'Mission Road Site',
                proposedSolution: 'Fibre-Optic',
                households: 2,
              },
            ],
            originalFileName: 'template_nine.xlsx',
          },
          _previousTemplate9Id: 42,
          _source: {
            source: 'rfi',
            rfiNumber: 'RFI-01',
            date: expect.any(String),
          },
          _errors: {},
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {},
      });
    });

    expect(screen.getByText(/Template 9 processing successful/)).toBeVisible();
  });

  it('should show error when template nine when upload fails', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            error: 'failed to process template upload',
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

    const file = new File([new ArrayBuffer(1)], 'template_nine.xlsx', {
      type: 'application/excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[2];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createAttachmentMutation',
      {
        input: {
          attachment: {
            file: expect.anything(),
            fileName: 'template_nine.xlsx',
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

    expect(screen.getByText('template_nine.xlsx')).toBeInTheDocument();

    expect(screen.getByText(/Template 9 validation failed/)).toBeVisible();
  });

  it('should revert formData for Template 1 when deleted', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

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

    // Click delete icon
    const deleteButton = screen.getAllByTestId('file-delete-btn')[0]; // assume each file has a delete button with testId
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'deleteAttachmentMutation',
      {
        input: {
          attachmentPatch: {
            archivedAt: expect.anything(),
          },
          rowId: 1,
        },
      }
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          updateAttachmentByRowId: {
            attachment: {
              id: 1,
              rowId: 1,
            },
          },
        },
      });
    });

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
              geographicNamesRfi: true,
              geographicCoverageMap: expect.anything(),
            },
          },
          rfiRowId: 1,
        },
      }
    );
  });

  it('should revert formData for Template 2 when deleted', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const dateInput = screen.getAllByPlaceholderText('YYYY-MM-DD')[0];

    await act(async () => {
      fireEvent.change(dateInput, {
        target: {
          value: '2025-07-01',
        },
      });
    });

    const file = new File(
      [new ArrayBuffer(1)],
      'template_two_to_be_deleted.xlsx',
      {
        type: 'application/excel',
      }
    );

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
            fileName: 'template_two_to_be_deleted.xlsx',
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
              id: '1',
              rowId: 1,
              file: 'string',
            },
          },
        },
      });
    });

    expect(
      screen.getByText('template_two_to_be_deleted.xlsx')
    ).toBeInTheDocument();

    // Click delete icon
    const deleteButton = screen.getAllByTestId('file-delete-btn')[0]; // assume each file has a delete button with testId
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'deleteAttachmentMutation',
      {
        input: {
          attachmentPatch: {
            archivedAt: expect.anything(),
          },
          rowId: 1,
        },
      }
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          updateAttachmentByRowId: {
            attachment: {
              id: '1',
              rowId: 1,
            },
          },
        },
      });
    });

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
              geographicCoverageMapRfi: true,
              geographicNamesRfi: true,
              geographicCoverageMap: expect.anything(),
              detailedBudget: null,
            },
          },
          rfiRowId: 1,
        },
      }
    );
  });

  it('should revert formData for Template 9 when deleted', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const dateInput = screen.getAllByPlaceholderText('YYYY-MM-DD')[0];

    await act(async () => {
      fireEvent.change(dateInput, {
        target: {
          value: '2025-07-01',
        },
      });
    });

    const file = new File(
      [new ArrayBuffer(1)],
      'template_nine_to_be_deleted.xlsx',
      {
        type: 'application/excel',
      }
    );

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
            fileName: 'template_nine_to_be_deleted.xlsx',
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
              id: '1',
              rowId: 1,
              file: 'string',
            },
          },
        },
      });
    });

    expect(
      screen.getByText('template_nine_to_be_deleted.xlsx')
    ).toBeInTheDocument();

    // Click delete icon
    const deleteButton = screen.getAllByTestId('file-delete-btn')[0]; // assume each file has a delete button with testId
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'deleteAttachmentMutation',
      {
        input: {
          attachmentPatch: {
            archivedAt: expect.anything(),
          },
          rowId: 1,
        },
      }
    );

    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          updateAttachmentByRowId: {
            attachment: {
              id: '1',
              rowId: 1,
            },
          },
        },
      });
    });

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
              geographicCoverageMapRfi: true,
              geographicNamesRfi: true,
              // old existing data only
              geographicCoverageMap: [
                {
                  uuid: 1,
                  name: '1.kmz',
                  size: 0,
                  type: '',
                  uploadedAt: expect.anything(),
                },
                {
                  uuid: 2,
                  name: '2.kmz',
                  size: 0,
                  type: '',
                  uploadedAt: expect.anything(),
                },
              ],
              detailedBudget: null,
            },
          },
          rfiRowId: 1,
        },
      }
    );
  });

  it('when cancelled user should get redirected to rfi page with toast', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const cancelButton = screen.getByRole('button', {
      name: 'Cancel',
    });

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(routerPush).toHaveBeenCalledWith('/analyst/application/123/rfi');

    expect(screen.getByText(/File upload cancelled/)).toBeVisible();
  });
});
