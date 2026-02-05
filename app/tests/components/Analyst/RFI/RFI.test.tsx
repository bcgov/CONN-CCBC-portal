import { act, screen } from '@testing-library/react';
import { graphql } from 'react-relay';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';
import RFI from 'components/Analyst/RFI/RFI';
import compiledQuery, {
  RFITestQuery,
} from '__generated__/RFITestQuery.graphql';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import { mocked } from 'jest-mock';
import { useRouter } from 'next/router';

jest.mock('lib/helpers/useEmailNotification');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockNotifyHHCountUpdate = jest.fn();
const mockNotifyDocumentUpload = jest.fn();
mocked(useEmailNotification).mockReturnValue({
  notifyHHCountUpdate: mockNotifyHHCountUpdate,
  notifyDocumentUpload: mockNotifyDocumentUpload,
});

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
  },
} as any);

const testQuery = graphql`
  query RFITestQuery($rowId: Int!) @relay_test_operation {
    rfiDataByRowId(rowId: $rowId) {
      ...RFI_query
    }
  }
`;

const mockQueryPayload = {
  RfiData() {
    return {
      rowId: 1,
      rfiNumber: 'RFI-01',
      jsonData: {
        rfiEmailCorrespondance: [],
      },
    };
  },
};

const componentTestingHelper = new ComponentTestingHelper<RFITestQuery>({
  component: RFI,
  testQuery,
  compiledQuery,
  defaultQueryResolver: mockQueryPayload,
  getPropsFromTestQuery: (data) => ({
    rfiDataByRfiDataId: data.rfiDataByRowId,
    id: 'test-id',
    ccbcNumber: 'CCBC-12345',
    applicationRowId: 1,
  }),
});

describe('The RFI component', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
    jest.clearAllMocks();
  });

  it('should render the RFI component with RFI number', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('RFI-01')).toBeInTheDocument();
  });

  it('should render the edit button', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByLabelText('Edit RFI-01')
    ).toBeInTheDocument();
  });

  it('should not send email notification when no new files are uploaded', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // Simulate form change without new files
    const formData = {
      rfiEmailCorrespondance: [],
    };

    await act(async () => {
      // Trigger onChange with no new files
      const formBase = screen.getByTestId('form-base');
      if (formBase) {
        // FormBase onChange is called internally, we simulate it through the mutation
        componentTestingHelper.environment.mock.resolveMostRecentOperation({
          data: {
            updateRfiData: {
              rfiData: {
                id: 'test-id',
                jsonData: formData,
              },
            },
          },
        });
      }
    });

    expect(mockNotifyDocumentUpload).not.toHaveBeenCalled();
  });

  it('should send email notification when new files are uploaded', async () => {
    const mockRfiData = {
      RfiData() {
        return {
          rowId: 1,
          rfiNumber: 'RFI-01',
          jsonData: {
            rfiEmailCorrespondance: [
              {
                name: 'existing-file.pdf',
                type: 'application/pdf',
                uploadedAt: '2024-01-01T00:00:00.000Z',
              },
            ],
          },
        };
      },
    };

    componentTestingHelper.loadQuery(mockRfiData);
    componentTestingHelper.renderComponent();

    // Simulate form change with new files
    const newFormData = {
      rfiEmailCorrespondance: [
        {
          name: 'existing-file.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          name: 'new-document.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
        {
          name: 'new-report.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uploadedAt: '2024-08-24T11:05:00.000Z',
        },
      ],
    };

    await act(async () => {
      componentTestingHelper.expectMutationToBeCalled(
        'updateRfiJsonDataMutation',
        {
          input: {
            id: 'test-id',
            rfiDataPatch: {
              jsonData: newFormData,
            },
          },
        }
      );

      // Resolve the mutation to trigger onCompleted
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          updateRfiData: {
            rfiData: {
              id: 'test-id',
              jsonData: newFormData,
            },
          },
        },
      });
    });

    // Wait for the notification to be called
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockNotifyDocumentUpload).toHaveBeenCalledWith('1', {
      ccbcNumber: 'CCBC-12345',
      documentType: 'Email Correspondence',
      documentNames: ['new-document.pdf', 'new-report.docx'],
      fileDetails: [
        {
          name: 'new-document.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
        {
          name: 'new-report.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uploadedAt: '2024-08-24T11:05:00.000Z',
        },
      ],
      timestamp: expect.any(String),
      rfiNumber: 'RFI-01',
    });
  });

  it('should include file type as "Unknown" when type is not provided', async () => {
    const mockRfiData = {
      RfiData() {
        return {
          rowId: 1,
          rfiNumber: 'RFI-01',
          jsonData: {
            rfiEmailCorrespondance: [],
          },
        };
      },
    };

    componentTestingHelper.loadQuery(mockRfiData);
    componentTestingHelper.renderComponent();

    // Simulate form change with file without type
    const newFormData = {
      rfiEmailCorrespondance: [
        {
          name: 'file-without-type.txt',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
      ],
    };

    await act(async () => {
      componentTestingHelper.expectMutationToBeCalled(
        'updateRfiJsonDataMutation',
        {
          input: {
            id: 'test-id',
            rfiDataPatch: {
              jsonData: newFormData,
            },
          },
        }
      );

      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          updateRfiData: {
            rfiData: {
              id: 'test-id',
              jsonData: newFormData,
            },
          },
        },
      });
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockNotifyDocumentUpload).toHaveBeenCalledWith('1', {
      ccbcNumber: 'CCBC-12345',
      documentType: 'Email Correspondence',
      documentNames: ['file-without-type.txt'],
      fileDetails: [
        {
          name: 'file-without-type.txt',
          type: 'Unknown',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
      ],
      timestamp: expect.any(String),
      rfiNumber: 'RFI-01',
    });
  });

  it('should handle multiple file uploads in a single change', async () => {
    const mockRfiData = {
      RfiData() {
        return {
          rowId: 1,
          rfiNumber: 'RFI-02',
          jsonData: {
            rfiEmailCorrespondance: [],
          },
        };
      },
    };

    // Need to override props for this test
    const customProps = {
      ccbcNumber: 'CCBC-67890',
      applicationRowId: 2,
    };

    componentTestingHelper.loadQuery(mockRfiData);
    componentTestingHelper.renderComponent(undefined, {
      ...componentTestingHelper.getPropsFromTestQuery({ rfiDataByRowId: mockRfiData.RfiData() }),
      ...customProps,
    });

    const newFormData = {
      rfiEmailCorrespondance: [
        {
          name: 'file1.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
        {
          name: 'file2.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          uploadedAt: '2024-08-24T11:01:00.000Z',
        },
        {
          name: 'file3.png',
          type: 'image/png',
          uploadedAt: '2024-08-24T11:02:00.000Z',
        },
      ],
    };

    await act(async () => {
      componentTestingHelper.expectMutationToBeCalled(
        'updateRfiJsonDataMutation',
        {
          input: {
            id: 'test-id',
            rfiDataPatch: {
              jsonData: newFormData,
            },
          },
        }
      );

      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          updateRfiData: {
            rfiData: {
              id: 'test-id',
              jsonData: newFormData,
            },
          },
        },
      });
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockNotifyDocumentUpload).toHaveBeenCalledWith('2', {
      ccbcNumber: 'CCBC-67890',
      documentType: 'Email Correspondence',
      documentNames: ['file1.pdf', 'file2.xlsx', 'file3.png'],
      fileDetails: expect.arrayContaining([
        expect.objectContaining({
          name: 'file1.pdf',
          type: 'application/pdf',
        }),
        expect.objectContaining({
          name: 'file2.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        expect.objectContaining({
          name: 'file3.png',
          type: 'image/png',
        }),
      ]),
      timestamp: expect.any(String),
      rfiNumber: 'RFI-02',
    });
  });

  it('should not send email on mutation error', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const newFormData = {
      rfiEmailCorrespondance: [
        {
          name: 'error-file.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
      ],
    };

    await act(async () => {
      componentTestingHelper.expectMutationToBeCalled(
        'updateRfiJsonDataMutation',
        {
          input: {
            id: 'test-id',
            rfiDataPatch: {
              jsonData: newFormData,
            },
          },
        }
      );

      // Reject the mutation with an error
      componentTestingHelper.environment.mock.rejectMostRecentOperation(
        new Error('Mutation failed')
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Email should not be sent on error
    expect(mockNotifyDocumentUpload).not.toHaveBeenCalled();
  });

  describe('File detection logic', () => {
    it('should correctly detect new files when old array is empty', async () => {
      const mockRfiData = {
        RfiData() {
          return {
            rowId: 1,
            rfiNumber: 'RFI-01',
            jsonData: {
              rfiEmailCorrespondance: [],
            },
          };
        },
      };

      componentTestingHelper.loadQuery(mockRfiData);
      componentTestingHelper.renderComponent();

      const newFormData = {
        rfiEmailCorrespondance: [
          {
            name: 'first-file.pdf',
            type: 'application/pdf',
            uploadedAt: '2024-08-24T11:00:00.000Z',
          },
        ],
      };

      await act(async () => {
        componentTestingHelper.expectMutationToBeCalled(
          'updateRfiJsonDataMutation',
          {
            input: {
              id: 'test-id',
              rfiDataPatch: {
                jsonData: newFormData,
              },
            },
          }
        );

        componentTestingHelper.environment.mock.resolveMostRecentOperation({
          data: {
            updateRfiData: {
              rfiData: {
                id: 'test-id',
                jsonData: newFormData,
              },
            },
          },
        });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockNotifyDocumentUpload).toHaveBeenCalledWith('1', {
        ccbcNumber: 'CCBC-12345',
        documentType: 'Email Correspondence',
        documentNames: ['first-file.pdf'],
        fileDetails: [
          {
            name: 'first-file.pdf',
            type: 'application/pdf',
            uploadedAt: '2024-08-24T11:00:00.000Z',
          },
        ],
        timestamp: expect.any(String),
        rfiNumber: 'RFI-01',
      });
    });

    it('should only send email for newly added files, not existing ones', async () => {
      const mockRfiData = {
        RfiData() {
          return {
            rowId: 1,
            rfiNumber: 'RFI-01',
            jsonData: {
              rfiEmailCorrespondance: [
                {
                  name: 'old-file-1.pdf',
                  type: 'application/pdf',
                  uploadedAt: '2024-01-01T00:00:00.000Z',
                },
                {
                  name: 'old-file-2.docx',
                  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  uploadedAt: '2024-01-02T00:00:00.000Z',
                },
              ],
            },
          };
        },
      };

      componentTestingHelper.loadQuery(mockRfiData);
      componentTestingHelper.renderComponent();

      const newFormData = {
        rfiEmailCorrespondance: [
          {
            name: 'old-file-1.pdf',
            type: 'application/pdf',
            uploadedAt: '2024-01-01T00:00:00.000Z',
          },
          {
            name: 'old-file-2.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            uploadedAt: '2024-01-02T00:00:00.000Z',
          },
          {
            name: 'new-file.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            uploadedAt: '2024-08-24T11:00:00.000Z',
          },
        ],
      };

      await act(async () => {
        componentTestingHelper.expectMutationToBeCalled(
          'updateRfiJsonDataMutation',
          {
            input: {
              id: 'test-id',
              rfiDataPatch: {
                jsonData: newFormData,
              },
            },
          }
        );

        componentTestingHelper.environment.mock.resolveMostRecentOperation({
          data: {
            updateRfiData: {
              rfiData: {
                id: 'test-id',
                jsonData: newFormData,
              },
            },
          },
        });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Should only include the NEW file, not the old ones
      expect(mockNotifyDocumentUpload).toHaveBeenCalledWith('1', {
        ccbcNumber: 'CCBC-12345',
        documentType: 'Email Correspondence',
        documentNames: ['new-file.xlsx'],
        fileDetails: [
          {
            name: 'new-file.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            uploadedAt: '2024-08-24T11:00:00.000Z',
          },
        ],
        timestamp: expect.any(String),
        rfiNumber: 'RFI-01',
      });
    });

    it('should not send email when array length decreases (file removed)', async () => {
      const mockRfiData = {
        RfiData() {
          return {
            rowId: 1,
            rfiNumber: 'RFI-01',
            jsonData: {
              rfiEmailCorrespondance: [
                {
                  name: 'file1.pdf',
                  type: 'application/pdf',
                  uploadedAt: '2024-01-01T00:00:00.000Z',
                },
                {
                  name: 'file2.pdf',
                  type: 'application/pdf',
                  uploadedAt: '2024-01-02T00:00:00.000Z',
                },
              ],
            },
          };
        },
      };

      componentTestingHelper.loadQuery(mockRfiData);
      componentTestingHelper.renderComponent();

      const newFormData = {
        rfiEmailCorrespondance: [
          {
            name: 'file1.pdf',
            type: 'application/pdf',
            uploadedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      };

      await act(async () => {
        componentTestingHelper.expectMutationToBeCalled(
          'updateRfiJsonDataMutation',
          {
            input: {
              id: 'test-id',
              rfiDataPatch: {
                jsonData: newFormData,
              },
            },
          }
        );

        componentTestingHelper.environment.mock.resolveMostRecentOperation({
          data: {
            updateRfiData: {
              rfiData: {
                id: 'test-id',
                jsonData: newFormData,
              },
            },
          },
        });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Should NOT send email when files are removed
      expect(mockNotifyDocumentUpload).not.toHaveBeenCalled();
    });

    it('should not send email when array length stays the same', async () => {
      const mockRfiData = {
        RfiData() {
          return {
            rowId: 1,
            rfiNumber: 'RFI-01',
            jsonData: {
              rfiEmailCorrespondance: [
                {
                  name: 'file1.pdf',
                  type: 'application/pdf',
                  uploadedAt: '2024-01-01T00:00:00.000Z',
                },
              ],
            },
          };
        },
      };

      componentTestingHelper.loadQuery(mockRfiData);
      componentTestingHelper.renderComponent();

      const newFormData = {
        rfiEmailCorrespondance: [
          {
            name: 'file1.pdf',
            type: 'application/pdf',
            uploadedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      };

      await act(async () => {
        componentTestingHelper.expectMutationToBeCalled(
          'updateRfiJsonDataMutation',
          {
            input: {
              id: 'test-id',
              rfiDataPatch: {
                jsonData: newFormData,
              },
            },
          }
        );

        componentTestingHelper.environment.mock.resolveMostRecentOperation({
          data: {
            updateRfiData: {
              rfiData: {
                id: 'test-id',
                jsonData: newFormData,
              },
            },
          },
        });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Should NOT send email when no new files
      expect(mockNotifyDocumentUpload).not.toHaveBeenCalled();
    });

    it('should handle mixed file types correctly', async () => {
      const mockRfiData = {
        RfiData() {
          return {
            rowId: 1,
            rfiNumber: 'RFI-01',
            jsonData: {
              rfiEmailCorrespondance: [],
            },
          };
        },
      };

      componentTestingHelper.loadQuery(mockRfiData);
      componentTestingHelper.renderComponent();

      const newFormData = {
        rfiEmailCorrespondance: [
          {
            name: 'document.pdf',
            type: 'application/pdf',
            uploadedAt: '2024-08-24T11:00:00.000Z',
          },
          {
            name: 'spreadsheet.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            uploadedAt: '2024-08-24T11:01:00.000Z',
          },
          {
            name: 'image.png',
            type: 'image/png',
            uploadedAt: '2024-08-24T11:02:00.000Z',
          },
          {
            name: 'unknown-file',
            uploadedAt: '2024-08-24T11:03:00.000Z',
          },
        ],
      };

      await act(async () => {
        componentTestingHelper.expectMutationToBeCalled(
          'updateRfiJsonDataMutation',
          {
            input: {
              id: 'test-id',
              rfiDataPatch: {
                jsonData: newFormData,
              },
            },
          }
        );

        componentTestingHelper.environment.mock.resolveMostRecentOperation({
          data: {
            updateRfiData: {
              rfiData: {
                id: 'test-id',
                jsonData: newFormData,
              },
            },
          },
        });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockNotifyDocumentUpload).toHaveBeenCalledWith('1', {
        ccbcNumber: 'CCBC-12345',
        documentType: 'Email Correspondence',
        documentNames: ['document.pdf', 'spreadsheet.xlsx', 'image.png', 'unknown-file'],
        fileDetails: [
          {
            name: 'document.pdf',
            type: 'application/pdf',
            uploadedAt: '2024-08-24T11:00:00.000Z',
          },
          {
            name: 'spreadsheet.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            uploadedAt: '2024-08-24T11:01:00.000Z',
          },
          {
            name: 'image.png',
            type: 'image/png',
            uploadedAt: '2024-08-24T11:02:00.000Z',
          },
          {
            name: 'unknown-file',
            type: 'Unknown',
            uploadedAt: '2024-08-24T11:03:00.000Z',
          },
        ],
        timestamp: expect.any(String),
        rfiNumber: 'RFI-01',
      });
    });
  });

  describe('Props handling', () => {
    it('should use applicationRowId when provided', async () => {
      const mockRfiData = {
        RfiData() {
          return {
            rowId: 1,
            rfiNumber: 'RFI-01',
            jsonData: {
              rfiEmailCorrespondance: [],
            },
          };
        },
      };

      componentTestingHelper.loadQuery(mockRfiData);
      componentTestingHelper.renderComponent(undefined, {
        rfiDataByRfiDataId: mockRfiData.RfiData(),
        id: 'test-id',
        ccbcNumber: 'CCBC-99999',
        applicationRowId: 999,
      });

      const newFormData = {
        rfiEmailCorrespondance: [
          {
            name: 'test.pdf',
            type: 'application/pdf',
            uploadedAt: '2024-08-24T11:00:00.000Z',
          },
        ],
      };

      await act(async () => {
        componentTestingHelper.expectMutationToBeCalled(
          'updateRfiJsonDataMutation',
          {
            input: {
              id: 'test-id',
              rfiDataPatch: {
                jsonData: newFormData,
              },
            },
          }
        );

        componentTestingHelper.environment.mock.resolveMostRecentOperation({
          data: {
            updateRfiData: {
              rfiData: {
                id: 'test-id',
                jsonData: newFormData,
              },
            },
          },
        });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Should use applicationRowId (999) not router applicationId
      expect(mockNotifyDocumentUpload).toHaveBeenCalledWith('999', expect.objectContaining({
        ccbcNumber: 'CCBC-99999',
      }));
    });

    it('should fallback to router applicationId when applicationRowId is not provided', async () => {
      const mockRfiData = {
        RfiData() {
          return {
            rowId: 1,
            rfiNumber: 'RFI-01',
            jsonData: {
              rfiEmailCorrespondance: [],
            },
          };
        },
      };

      componentTestingHelper.loadQuery(mockRfiData);
      componentTestingHelper.renderComponent(undefined, {
        rfiDataByRfiDataId: mockRfiData.RfiData(),
        id: 'test-id',
        ccbcNumber: 'CCBC-12345',
        applicationRowId: undefined,
      });

      const newFormData = {
        rfiEmailCorrespondance: [
          {
            name: 'test.pdf',
            type: 'application/pdf',
            uploadedAt: '2024-08-24T11:00:00.000Z',
          },
        ],
      };

      await act(async () => {
        componentTestingHelper.expectMutationToBeCalled(
          'updateRfiJsonDataMutation',
          {
            input: {
              id: 'test-id',
              rfiDataPatch: {
                jsonData: newFormData,
              },
            },
          }
        );

        componentTestingHelper.environment.mock.resolveMostRecentOperation({
          data: {
            updateRfiData: {
              rfiData: {
                id: 'test-id',
                jsonData: newFormData,
              },
            },
          },
        });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Should use router applicationId from mock (123)
      expect(mockNotifyDocumentUpload).toHaveBeenCalledWith('123', expect.any(Object));
    });
  });
});
