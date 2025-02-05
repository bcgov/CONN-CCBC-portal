import { screen, fireEvent, act } from '@testing-library/react';
import ApplicantRfiPage from '../../../../../../pages/applicantportal/form/[id]/rfi/[applicantRfiId]';
import PageTestingHelper from '../../../../../utils/pageTestingHelper';
import compiledPageQuery, {
  ApplicantRfiIdQuery,
} from '../../../../../../__generated__/ApplicantRfiIdQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      rfiDataByRowId: {
        jsonData: {
          rfiDueBy: '2022-12-22',
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
        rowId: 1,
        rfiNumber: 'CCBC-01001-01',
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      applicationByRowId: {
        rfi: {
          updatedAt: '2022-12-01',
        },
        formData: {
          jsonData: {},
          formSchemaId: 'test',
        },
        projectName: 'projName',
        status: 'Received',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<ApplicantRfiIdQuery>({
  pageComponent: ApplicantRfiPage,
  compiledQuery: compiledPageQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    applicationId: 1,
    rfiId: 1,
  },
});

describe('The applicantRfiId Page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicantRfiId: '1', id: '1' },
    });
  });

  it('displays the rfiStatus header', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText(/Last saved: Dec 1/)).toBeInTheDocument();
  });

  it('displays the due by date', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(/Please upload the following files by 2022-12-22/)
    ).toBeInTheDocument();
  });

  it('calls the updateRfiMutationWithTracking when clicking save', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    pageTestingHelper.expectMutationToBeCalled(
      'updateWithTrackingRfiMutation',
      {
        input: {
          jsonData: {
            rfiType: [],
            rfiAdditionalFiles: {
              eligibilityAndImpactsCalculatorRfi: true,
              detailedBudgetRfi: true,
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
            rfiDueBy: '2022-12-22',
          },
          rfiRowId: 1,
        },
      }
    );

    act(() => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {},
      });
    });
  });

  it('uses template 1 and 2 data to auto populate form data', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const mockSuccessResponseTemplateOne = {
      totalNumberHouseholdsImpacted: 60,
      finalEligibleHouseholds: 4,
    };
    const mockFetchPromiseTemplateOne = Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ result: mockSuccessResponseTemplateOne }),
    });

    const mockSuccessResponseTemplateTwo = {
      totalEligibleCosts: 92455,
      totalProjectCosts: 101230,
    };
    const mockFetchPromiseTemplateTwo = Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ result: mockSuccessResponseTemplateTwo }),
    });
    global.fetch = jest.fn((url) => {
      if (url.includes('templateNumber=1')) return mockFetchPromiseTemplateOne;
      return mockFetchPromiseTemplateTwo;
    });

    const file = new File([new ArrayBuffer(1)], 'file.xlsx', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[0];
    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
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
    const formData = new FormData();
    formData.append('file', file);

    expect(global.fetch).toHaveBeenCalledOnce();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/applicant/template?templateNumber=1',
      { body: formData, method: 'POST' }
    );

    const inputFile2 = screen.getAllByTestId('file-test')[1];
    await act(async () => {
      fireEvent.change(inputFile2, { target: { files: [file] } });
    });

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 2,
              file: 'string',
            },
          },
        },
      });
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/applicant/template?templateNumber=2',
      { body: formData, method: 'POST' }
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    pageTestingHelper.expectMutationToBeCalled('updateRfiAndFormDataMutation', {
      rfiInput: {
        jsonData: {
          rfiType: [],
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
            eligibilityAndImpactsCalculator: [
              {
                id: 1,
                uuid: 'string',
                name: 'file.xlsx',
                size: 1,
                type: 'application/vnd.ms-excel',
                uploadedAt: expect.anything(),
              },
            ],
            detailedBudget: [
              {
                id: 2,
                uuid: 'string',
                name: 'file.xlsx',
                size: 1,
                type: 'application/vnd.ms-excel',
                uploadedAt: expect.anything(),
              },
            ],
          },
          rfiDueBy: '2022-12-22',
        },
        rfiRowId: 1,
      },
      formInput: {
        applicationRowId: 1,
        jsonData: {
          benefits: {
            householdsImpactedIndigenous: 60,
            numberOfHouseholds: 4,
          },
          budgetDetails: {
            totalEligibleCosts: 92455,
            totalProjectCost: 101230,
          },
        },
        reasonForChange: 'Auto updated from upload for RFI: CCBC-01001-01',
        formSchemaId: 'test',
      },
    });
  });
  it('uses template 1 and 2 data to notify if failed template read', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const mockSuccessResponseTemplateOne = {
      totalNumberHouseholdsImpacted: 60,
      finalEligibleHouseholds: 4,
    };
    const mockFetchPromiseTemplateOne = Promise.resolve({
      ok: false,
      status: 200,
      json: () => Promise.resolve({ result: mockSuccessResponseTemplateOne }),
    });

    const mockSuccessResponseTemplateTwo = {
      totalEligibleCosts: 92455,
      totalProjectCosts: 101230,
    };
    const mockFetchPromiseTemplateTwo = Promise.resolve({
      ok: false,
      status: 200,
      json: () => Promise.resolve({ result: mockSuccessResponseTemplateTwo }),
    });
    global.fetch = jest.fn((url) => {
      if (url.includes('templateNumber=1')) return mockFetchPromiseTemplateOne;
      return mockFetchPromiseTemplateTwo;
    });

    const file = new File([new ArrayBuffer(1)], 'file.xlsx', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[0];
    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    await act(async () => {
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
    const formData = new FormData();
    formData.append('file', file);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/applicant/template?templateNumber=1',
      { body: formData, method: 'POST' }
    );

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/email/notifyFailedReadOfTemplateData',
      {
        body: expect.stringContaining(
          '{"applicationId":"1","host":"http://localhost","params":{"templateNumber":1,"uuid":"string","uploadedAt":'
        ),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }
    );

    const inputFile2 = screen.getAllByTestId('file-test')[1];
    await act(async () => {
      fireEvent.change(inputFile2, { target: { files: [file] } });
    });

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 2,
              file: 'string',
            },
          },
        },
      });
    });

    expect(global.fetch).toHaveBeenCalledTimes(4);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/applicant/template?templateNumber=2',
      { body: formData, method: 'POST' }
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    pageTestingHelper.expectMutationToBeCalled(
      'updateWithTrackingRfiMutation',
      {
        input: {
          jsonData: {
            rfiType: [],
            rfiAdditionalFiles: {
              eligibilityAndImpactsCalculatorRfi: true,
              detailedBudgetRfi: true,
              eligibilityAndImpactsCalculator: [
                {
                  id: 1,
                  uuid: 'string',
                  name: 'file.xlsx',
                  size: 1,
                  type: 'application/vnd.ms-excel',
                  uploadedAt: expect.anything(),
                },
              ],
              detailedBudget: [
                {
                  id: 2,
                  uuid: 'string',
                  name: 'file.xlsx',
                  size: 1,
                  type: 'application/vnd.ms-excel',
                  uploadedAt: expect.anything(),
                },
              ],
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
            rfiDueBy: '2022-12-22',
          },
          rfiRowId: 1,
        },
      }
    );
  });
});
