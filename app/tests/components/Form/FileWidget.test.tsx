import ApplicationForm from 'components/Form/ApplicationForm';
import { processFileTemplate } from 'lib/theme/widgets/FileWidget';
import { graphql } from 'react-relay';
import compiledQuery, {
  FileWidgetTestQuery,
} from '__generated__/FileWidgetTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import getFormPage from 'utils/getFormPage';
import { uiSchema, schema } from 'formSchema';
import ComponentTestingHelper from '../../utils/componentTestingHelper';

const testQuery = graphql`
  query FileWidgetTestQuery {
    # Spread the fragment you want to test here
    application(id: "TestApplicationID") {
      ...ApplicationForm_application
    }

    query {
      ...ApplicationForm_query
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationID',
      formData: {
        formByFormSchemaId: {
          jsonSchema: schema,
        },
      },
      status: 'draft',
      updatedAt: '2022-09-12T14:04:10.790848-07:00',
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

const componentTestingHelper = new ComponentTestingHelper<FileWidgetTestQuery>({
  component: ApplicationForm,
  testQuery,
  compiledQuery,
  defaultQueryResolver: mockQueryPayload,
  getPropsFromTestQuery: (data) => ({
    application: data.application,
    pageNumber: getFormPage(uiSchema['ui:order'], 'coverage'),
    query: data.query,
    formContext: { setTemplateData: jest.fn() },
  }),
});

describe('The FileWidget', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();

    componentTestingHelper.setMockRouterValues({
      query: { id: '1' },
    });
  });

  it('should render the upload button', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.queryAllByText('Upload(s)')[0]).toBeVisible();
  });

  it('should render the file widget title', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByText(
        `ISED's Eligibility Mapping Tool - Coverage Assessment and Statistics`
      )
    ).toBeVisible();
  });

  it('should render the file widget description', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByText(
        'Please upload the XML file that was attached to the email you received upon completion of the project coverage.'
      )
    ).toBeVisible();
  });

  it('calls createAttachmentMutation and renders the filename and correct button label', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const file = new File([new ArrayBuffer(1)], 'file.kmz', {
      type: 'application/vnd.google-earth.kmz',
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
            fileName: 'file.kmz',
            fileSize: '1 Bytes',
            fileType: 'application/vnd.google-earth.kmz',
            applicationId: 1,
          },
        },
      }
    );

    expect(screen.getByLabelText('loading')).toBeVisible();

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

    expect(screen.getByText('Replace')).toBeVisible();
    expect(screen.getByText('file.kmz')).toBeVisible();
  });

  it('calls deleteAttachmentMutation and renders the correct filename and button label', async () => {
    componentTestingHelper.loadQuery({
      ...mockQueryPayload,
      Application() {
        return {
          id: 'TestApplicationID',
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            jsonData: {
              coverage: {
                coverageAssessmentStatistics: [
                  {
                    id: 3,
                    uuid: 'a365945b-5631-4e52-af9f-515e6fdcf614',
                    name: 'file-2.kmz',
                    size: 0,
                    type: 'application/vnd.google-earth.kmz',
                  },
                ],
              },
            },
          },
          status: 'draft',
        };
      },
    });
    componentTestingHelper.renderComponent();

    expect(screen.getByText('file-2.kmz')).toBeVisible();
    expect(screen.getByText('Replace')).toBeVisible();

    const deleteButton = screen.getByTestId('file-delete-btn');

    deleteButton.click();

    componentTestingHelper.expectMutationToBeCalled(
      'deleteAttachmentMutation',
      {
        input: {
          attachmentPatch: {
            archivedAt: expect.any(String),
          },
          rowId: 3,
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          deleteAttachment: {
            attachment: {
              rowId: 3,
            },
          },
        },
      });
    });

    expect(screen.queryByText('file-2.kmz')).toBeNull();
    expect(screen.queryByText('Replace')).toBeNull();
  });

  it('renders multiple files and correct button label', async () => {
    componentTestingHelper.loadQuery({
      ...mockQueryPayload,
      Application() {
        return {
          id: 'TestApplicationID',
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            jsonData: {
              coverage: {
                currentNetworkInfastructure: [
                  {
                    id: 1,
                    uuid: 'a365945b-5631-4e52-af9f-515e6fdcf614',
                    name: 'file.kmz',
                    size: 0,
                    type: 'application/vnd.google-earth.kmz',
                  },
                  {
                    id: 2,
                    uuid: 'a365945b-5631-4e52-af9f-515e6fdcf614',
                    name: 'file-2.kmz',
                    size: 0,
                    type: 'application/vnd.google-earth.kmz',
                  },
                  {
                    id: 3,
                    uuid: 'a365945b-5631-4e52-af9f-515e6fdcf614',
                    name: 'file-3.kmz',
                    size: 0,
                    type: 'application/vnd.google-earth.kmz',
                  },
                ],
              },
            },
          },
          status: 'draft',
        };
      },
    });
    componentTestingHelper.renderComponent();

    expect(screen.getByText('file.kmz')).toBeVisible();
    expect(screen.getByText('file-2.kmz')).toBeVisible();
    expect(screen.getByText('file-3.kmz')).toBeVisible();
    expect(screen.getByText('Add file')).toBeVisible();
  });

  it('displays an error message when attempting to upload incorrect file type', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const file = new File([new ArrayBuffer(1)], 'image.png', {
      type: 'image/png',
    });

    const inputFile = screen.getAllByTestId('file-test')[0];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    expect(
      screen.getByText(
        'Please use an accepted file type. Accepted types for this field are:'
      )
    ).toBeVisible();
  });

  it("doesn't allow uploading a second file if the mutation is in flight", async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const file = new File([new ArrayBuffer(1)], 'file.kmz', {
      type: 'application/vnd.google-earth.kmz',
    });

    const inputFile = screen.getAllByTestId('file-test')[0];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    const getOperationNames = () =>
      componentTestingHelper.environment.mock
        .getAllOperations()
        .map((op) => op.fragment.node.name);

    expect(getOperationNames()).toEqual([
      'FileWidgetTestQuery',
      'createAttachmentMutation',
    ]);

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });
    // we have not resolved the mutation, so there should not be another mutation
    expect(getOperationNames()).toEqual([
      'FileWidgetTestQuery',
      'createAttachmentMutation',
    ]);
  });

  it('displays an error message when attempting to upload a file that is too large', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const file = {
      name: 'file-3.kmz',
      size: 104857601,
      type: 'application/vnd.google-earth.kmz',
    };

    const inputFile = screen.getAllByTestId('file-test')[0];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    expect(screen.getByText(/Files must be less than 100MB/)).toBeVisible();
  });

  it('displays an error message when the createAttachment mutation fails', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const file = new File([new ArrayBuffer(1)], 'file.kmz', {
      type: 'application/vnd.google-earth.kmz',
    });

    const inputFile = screen.getAllByTestId('file-test')[0];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    await act(async () =>
      componentTestingHelper.environment.mock.rejectMostRecentOperation(
        new Error()
      )
    );

    expect(screen.getByText(/File failed to upload/)).toBeVisible();
  });

  it('displays an error message when the deleteAttachment mutation fails', async () => {
    componentTestingHelper.loadQuery({
      ...mockQueryPayload,
      Application() {
        return {
          id: 'TestApplicationID',
          formData: {
            jsonData: {
              coverage: {
                coverageAssessmentStatistics: [
                  {
                    id: 3,
                    uuid: 'a365945b-5631-4e52-af9f-515e6fdcf614',
                    name: 'file-2.kmz',
                    size: 0,
                    type: 'application/vnd.google-earth.kmz',
                  },
                ],
              },
            },
            formByFormSchemaId: {
              jsonSchema: schema,
            },
          },
          status: 'draft',
        };
      },
    });
    componentTestingHelper.renderComponent();

    expect(screen.getByText('file-2.kmz')).toBeVisible();
    expect(screen.getByText('Replace')).toBeVisible();

    const deleteButton = screen.getByTestId('file-delete-btn');

    deleteButton.click();

    act(() => {
      componentTestingHelper.environment.mock.rejectMostRecentOperation(
        new Error()
      );
    });

    expect(screen.getByText('file-2.kmz')).toBeVisible();
    expect(screen.getByText('Replace')).toBeVisible();
    expect(screen.getByText(/Delete file failed/)).toBeVisible();
  });

  it('File Widget gets application id from url', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const applicationId = '5';
    componentTestingHelper.router.query.id = null;
    componentTestingHelper.router.query.applicationId = applicationId;

    const file = new File([new ArrayBuffer(1)], 'file.kmz', {
      type: 'application/vnd.google-earth.kmz',
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
            fileName: 'file.kmz',
            fileSize: '1 Bytes',
            fileType: 'application/vnd.google-earth.kmz',
            applicationId: parseInt(applicationId, 10),
          },
        },
      }
    );
  });

  it('displays the file download error modal for infected file', async () => {
    componentTestingHelper.loadQuery({
      ...mockQueryPayload,
      Application() {
        return {
          id: 'TestApplicationID',
          formData: {
            jsonData: {
              coverage: {
                coverageAssessmentStatistics: [
                  {
                    id: 3,
                    uuid: 'a365945b-5631-4e52-af9f-515e6fdcf614',
                    name: 'file-2.kmz',
                    size: 0,
                    type: 'application/vnd.google-earth.kmz',
                  },
                ],
              },
            },
            formByFormSchemaId: {
              jsonSchema: schema,
            },
          },
          status: 'draft',
        };
      },
    });
    componentTestingHelper.renderComponent();

    expect(screen.getByText('file-2.kmz')).toBeVisible();
    expect(screen.getByTestId('file-download-link')).toBeVisible();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ avstatus: 'dirty' }),
      })
    ) as jest.Mock;

    const downloadLink = screen.getByTestId('file-download-link');

    await act(async () => {
      fireEvent.click(downloadLink);
    });

    expect(screen.getByText('File error')).toBeInTheDocument();
    expect(screen.getByText('File error')).toBeVisible();

    const closeModal = screen.getByTestId('generic-yes-btn');

    // to improve code coverage
    await act(async () => {
      fireEvent.click(closeModal);
    });
  });

  it('uploading template data mutates form data', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 11,
      query: data.query,
    }));

    const mockSuccessResponseTemplateOne = {
      totalEligibleCosts: 92455,
      totalProjectCosts: 101230,
    };
    const mockFetchPromiseTemplateOne = Promise.resolve({
      json: () => Promise.resolve(mockSuccessResponseTemplateOne),
    });

    const mockSuccessResponseTemplateTwo = {
      totalEligibleCosts: 92455,
      totalProjectCosts: 101230,
    };
    const mockFetchPromiseTemplateTwo = Promise.resolve({
      json: () => Promise.resolve(mockSuccessResponseTemplateTwo),
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
    const formData = new FormData();
    formData.append('file', file);
    expect(global.fetch).toHaveBeenCalledOnce();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/applicant/template?templateNumber=1',
      { body: formData, method: 'POST' }
    );
  });

  describe('processFileTemplate function tests', () => {
    // Keep a reference to the original fetch.
    const originalFetch = global.fetch;

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
      global.fetch = originalFetch;
    });

    const file = { name: 'test.txt' };

    test('should return true and do nothing if file is not provided', async () => {
      const setTemplateData = jest.fn();
      //  file: null, setTemplateData, templateNumber: 1 }
      const result = await processFileTemplate(null, setTemplateData, 1);
      expect(result).toBe(true);
      expect(global.fetch).not.toHaveBeenCalled();
      expect(setTemplateData).not.toHaveBeenCalled();
    });

    test('should process template (non-9) when response is ok', async () => {
      const mockData = { key: 'value' };
      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });
      const setTemplateData = jest.fn();
      const result = await processFileTemplate(
        file,
        setTemplateData,
        5,
        false,
        1,
        'rfi-1'
      );
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/applicant/template?templateNumber=5`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
      expect(setTemplateData).toHaveBeenCalledWith({
        templateNumber: 5,
        data: mockData,
        templateName: file.name,
      });
      expect(result).toBe(true);
    });

    test('should set error for non-9 template when response is not ok', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: jest.fn(),
      });
      const setTemplateData = jest.fn();
      const result = await processFileTemplate(
        file,
        setTemplateData,
        3,
        false,
        1,
        'rfi-1'
      );
      expect(setTemplateData).toHaveBeenCalledWith({
        templateNumber: 3,
        error: true,
      });
      expect(result).toBe(false);
    });

    test('should catch error for non-9 template when fetch throws', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      const setTemplateData = jest.fn();
      const result = await processFileTemplate(
        file,
        setTemplateData,
        2,
        false,
        1,
        'rfi-1'
      );
      expect(setTemplateData).toHaveBeenCalledWith({
        templateNumber: 2,
        error: true,
      });
      expect(result).toBe(false);
    });

    test('should process template 9 when response is ok', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });
      const setTemplateData = jest.fn();
      const result = await processFileTemplate(
        file,
        setTemplateData,
        9,
        false,
        'form123',
        'rfi456'
      );
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/template-nine/rfi/form123/rfi456`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
      expect(setTemplateData).toHaveBeenCalledWith({
        templateNumber: 9,
        data: expect.any(Object),
        templateName: file.name,
      });
      expect(result).toBe(true);
    });

    test('should process applicant template 9 when response is ok', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });
      const setTemplateData = jest.fn();
      const result = await processFileTemplate(
        file,
        setTemplateData,
        9,
        true,
        'form123',
        'rfi456'
      );
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/template-nine/rfi/applicant/form123/rfi456`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
      expect(setTemplateData).toHaveBeenCalledWith({
        templateNumber: 9,
        templateName: file.name,
        data: {},
      });
      expect(result).toBe(true);
    });

    test('should set error for template 9 when response is not ok', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: jest.fn(),
      });
      const setTemplateData = jest.fn();
      const result = await processFileTemplate(
        file,
        setTemplateData,
        9,
        'form123',
        'rfi456'
      );
      expect(setTemplateData).toHaveBeenCalledWith({
        templateNumber: 9,
        error: true,
      });
      expect(result).toBe(false);
    });

    test('should return true if setTemplateData is not provided', async () => {
      const result = await processFileTemplate(file, undefined, 5);
      // With no setTemplateData, no fetch is performed and isTemplateValid remains true.
      expect(global.fetch).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
