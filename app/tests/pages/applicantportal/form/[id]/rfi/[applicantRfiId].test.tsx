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
            geographicNamesRfi: true,
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
        applicationFormTemplate9DataByApplicationId: {
          nodes: [
            {
              rowId: 1,
            },
          ],
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
      pathname: '/applicantportal/form/1/rfi/1',
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
              geographicNamesRfi: true,
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
        data: {
          updateRfi: {
            rfiData: {
              rowId: 1,
            },
          },
        },
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
            geographicNamesRfi: true,
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
              geographicNamesRfi: true,
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
  it('uses template 9 data and  creates new record', async () => {
    // load page test
    // mock fetch for template 9
    // upload fake template 9
    // click save
    // expect update rfi and create new record mutation to be called

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const mockSuccessResponseTemplateNine = {
      errors: [],
      projectZone: 'zone',
      geoName: 'geoName',
    };

    const mockFetchPromiseTemplateNine = Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ ...mockSuccessResponseTemplateNine }),
    });

    global.fetch = jest.fn((url) => {
      if (url.includes('template-nine')) return mockFetchPromiseTemplateNine;
      return Promise.resolve({ ok: true, status: 200 });
    });

    const file = new File([new ArrayBuffer(1)], 'file.xlsx', {
      type: 'application/vnd.ms-excel',
    });
    // grab the third file input since that is the one for template 9
    const inputFile = screen.getAllByTestId('file-test')[2];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 3,
              file: 'UUIDstring',
            },
          },
        },
      });
    });

    const formData = new FormData();
    formData.append('file', file);

    expect(global.fetch).toHaveBeenCalledOnce();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/template-nine/rfi/applicant/1/CCBC-01001-01',
      {
        body: formData,
        method: 'POST',
      }
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    pageTestingHelper.expectMutationToBeCalled(
      'updateRfiAndCreateTemplateNineDataMutation',
      {
        rfiInput: {
          jsonData: {
            rfiType: [],
            rfiAdditionalFiles: {
              geographicNamesRfi: true,
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
              geographicNames: [
                {
                  id: 3,
                  uuid: 'UUIDstring',
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
        templateNineInput: {
          _applicationId: 1,
          _jsonData: {
            errors: [],
            projectZone: 'zone',
            geoName: 'geoName',
          },
          _previousTemplate9Id: 1,
          _source: {
            source: 'RFI',
            uuid: 'UUIDstring',
          },
          _errors: [],
        },
      }
    );
  });

  it('uses template 1, 2, and 9 data to update form, rfi data, and create new record', async () => {
    // load page test
    // mock fetch for template 1, 2, and 9
    // upload fake template 1, 2, and 9
    // click save
    // expect update rfi, form, and create new record mutation to be called
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

    const mockSuccessResponseTemplateNine = {
      errors: [],
      projectZone: 'zone',
      geoName: 'geoName',
    };

    const mockFetchPromiseTemplateNine = Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ ...mockSuccessResponseTemplateNine }),
    });

    global.fetch = jest.fn((url) => {
      if (url.includes('templateNumber=1')) return mockFetchPromiseTemplateOne;
      if (url.includes('templateNumber=2')) return mockFetchPromiseTemplateTwo;
      return mockFetchPromiseTemplateNine;
    });

    const file = new File([new ArrayBuffer(1)], 'file.xlsx', {
      type: 'application/vnd.ms-excel',
    });

    const templateOneInputFile = screen.getAllByTestId('file-test')[0];
    const templateTwoInputFile = screen.getAllByTestId('file-test')[1];
    const templateNineInputFile = screen.getAllByTestId('file-test')[2];
    // upload template 1
    await act(async () => {
      fireEvent.change(templateOneInputFile, { target: { files: [file] } });
    });
    // resolve template 1 upload
    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 1,
              file: 'UUIDTemplateOne',
            },
          },
        },
      });
    });
    // upload template 2
    await act(async () => {
      fireEvent.change(templateTwoInputFile, { target: { files: [file] } });
    });
    // resolve template 2 upload
    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 2,
              file: 'UUIDTemplateTwo',
            },
          },
        },
      });
    });
    // upload template 9
    await act(async () => {
      fireEvent.change(templateNineInputFile, { target: { files: [file] } });
    });
    // resolve template 9 upload
    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 3,
              file: 'UUIDTemplateNine',
            },
          },
        },
      });
    });

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/applicant/template?templateNumber=1',
      { body: expect.any(FormData), method: 'POST' }
    );

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/applicant/template?templateNumber=2',
      { body: expect.any(FormData), method: 'POST' }
    );

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/template-nine/rfi/applicant/1/CCBC-01001-01',
      { body: expect.any(FormData), method: 'POST' }
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    pageTestingHelper.expectMutationToBeCalled(
      'updateFormRfiAndCreateTemplateNineDataMutation',
      {
        rfiInput: {
          jsonData: {
            rfiType: [],
            rfiAdditionalFiles: {
              geographicNamesRfi: true,
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
              eligibilityAndImpactsCalculator: [
                {
                  id: 1,
                  uuid: 'UUIDTemplateOne',
                  name: 'file.xlsx',
                  size: 1,
                  type: 'application/vnd.ms-excel',
                  uploadedAt: expect.anything(),
                },
              ],
              detailedBudget: [
                {
                  id: 2,
                  uuid: 'UUIDTemplateTwo',
                  name: 'file.xlsx',
                  size: 1,
                  type: 'application/vnd.ms-excel',
                  uploadedAt: expect.anything(),
                },
              ],
              geographicNames: [
                {
                  id: 3,
                  uuid: 'UUIDTemplateNine',
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
        templateNineInput: {
          _previousTemplate9Id: 1,
          _applicationId: 1,
          _jsonData: mockSuccessResponseTemplateNine,
          _source: {
            source: 'RFI',
            uuid: 'UUIDTemplateNine',
          },
          _errors: [],
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
      }
    );
  });
});
