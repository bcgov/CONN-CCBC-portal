import { act, fireEvent, screen } from '@testing-library/react';
import { graphql } from 'react-relay';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';
import RFIAnalystUpload from 'components/Analyst/RFI/RFIAnalystUpload';
import compiledQuery, {
  RFIAnalystUploadTestQuery,
} from '__generated__/RFIAnalystUploadTestQuery.graphql';

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
        formData: {
          formSchemaId: 1,
          jsonData: {},
        },
      },
      rfiDataByRowId: {
        rowId: 1,
        rfiNumber: 'RFI-01',
        jsonData: {
          rfiAdditionalFiles: {
            detailedBudgetRfi: true,
            eligibilityAndImpactsCalculatorRfi: true,
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

  it('should render the upload button', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getAllByRole('button', {
        name: 'Upload(s)',
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

  it('should call the createNewFormDataMutation on excel upload', async () => {
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

    expect(screen.getByText('template_one.xlsx')).toBeInTheDocument();

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
            rfiAdditionalFiles: {
              detailedBudgetRfi: true,
              eligibilityAndImpactsCalculatorRfi: true,
              eligibilityAndImpactsCalculator: expect.anything(),
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
  });
});
