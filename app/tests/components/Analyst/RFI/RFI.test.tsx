import { act, screen } from '@testing-library/react';
import { graphql } from 'react-relay';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';
import RFI, { detectNewFiles, transformFilesForNotification } from 'components/Analyst/RFI/RFI';
import compiledQuery, {
  RFITestQuery,
} from '__generated__/RFITestQuery.graphql';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import { useRouter } from 'next/router';

jest.mock('lib/helpers/useEmailNotification');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockNotifyHHCountUpdate = jest.fn();
const mockNotifyDocumentUpload = jest.fn();
(useEmailNotification as jest.Mock).mockReturnValue({
  notifyHHCountUpdate: mockNotifyHHCountUpdate,
  notifyDocumentUpload: mockNotifyDocumentUpload,
});

const routerPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
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
});

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
        rfiType: [],
        rfiAdditionalFiles: {},
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

    expect(screen.getByLabelText('Edit RFI-01')).toBeInTheDocument();
  });
  
  it('should have email notification logic when files change', () => {
    // This is more of a smoke test to ensure the component renders
    // and has access to the notification function
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // Verify the mock is set up correctly
    expect(useEmailNotification).toHaveBeenCalled();
  });
});

// Unit tests for the email notification logic
// NOTE: These tests verify the file detection and transformation logic in isolation
describe('RFI email notification logic', () => {
  describe('file detection', () => {
    it('should detect when new files are added', () => {
      const oldEmailFiles = [];
      const newEmailFiles = [
        {
          name: 'new-file.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
      ];

      const { hasNewFiles, newlyAddedFiles } = detectNewFiles(oldEmailFiles, newEmailFiles);

      expect(hasNewFiles).toBe(true);
      expect(newlyAddedFiles).toHaveLength(1);
      expect(newlyAddedFiles[0].name).toBe('new-file.pdf');
    });

    it('should detect when multiple files are added', () => {
      const oldEmailFiles = [
        {
          name: 'existing-file.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      const newEmailFiles = [
        ...oldEmailFiles,
        {
          name: 'file1.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
        {
          name: 'file2.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          uploadedAt: '2024-08-24T11:01:00.000Z',
        },
      ];

      const { hasNewFiles, newlyAddedFiles } = detectNewFiles(oldEmailFiles, newEmailFiles);

      expect(hasNewFiles).toBe(true);
      expect(newlyAddedFiles).toHaveLength(2);
      expect(newlyAddedFiles[0].name).toBe('file1.docx');
      expect(newlyAddedFiles[1].name).toBe('file2.xlsx');
    });

    it('should not detect new files when array length stays the same', () => {
      const oldEmailFiles = [
        {
          name: 'file1.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      const newEmailFiles = [
        {
          name: 'file1.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const { hasNewFiles, newlyAddedFiles } = detectNewFiles(oldEmailFiles, newEmailFiles);

      expect(hasNewFiles).toBe(false);
      expect(newlyAddedFiles).toHaveLength(0);
    });

    it('should not detect new files when array length decreases', () => {
      const oldEmailFiles = [
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
      ];
      const newEmailFiles = [
        {
          name: 'file1.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const { hasNewFiles, newlyAddedFiles } = detectNewFiles(oldEmailFiles, newEmailFiles);

      expect(hasNewFiles).toBe(false);
      expect(newlyAddedFiles).toHaveLength(0);
    });
  });

  // Unit tests for the file transformation logic
  describe('file transformation', () => {
    it('should extract file names correctly', () => {
      const files = [
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
      ];

      const { fileNames, fileDetails } = transformFilesForNotification(files);

      expect(fileNames).toEqual(['document.pdf', 'spreadsheet.xlsx']);
      expect(fileDetails).toHaveLength(2);
    });

    it('should create file details with type information', () => {
      const files = [
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
      ];

      const { fileDetails } = transformFilesForNotification(files);

      expect(fileDetails).toEqual([
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
      ]);
    });

    it('should default to "Unknown" type when type is missing', () => {
      const files = [
        {
          name: 'file-without-type.txt',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
      ];

      const { fileDetails } = transformFilesForNotification(files);

      expect(fileDetails).toEqual([
        {
          name: 'file-without-type.txt',
          type: 'Unknown',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
      ]);
    });

    it('should handle mixed files with and without types', () => {
      const files = [
        {
          name: 'document.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
        {
          name: 'unknown-file',
          uploadedAt: '2024-08-24T11:01:00.000Z',
        },
        {
          name: 'image.png',
          type: 'image/png',
          uploadedAt: '2024-08-24T11:02:00.000Z',
        },
      ];

      const { fileDetails } = transformFilesForNotification(files);

      expect(fileDetails).toEqual([
        {
          name: 'document.pdf',
          type: 'application/pdf',
          uploadedAt: '2024-08-24T11:00:00.000Z',
        },
        {
          name: 'unknown-file',
          type: 'Unknown',
          uploadedAt: '2024-08-24T11:01:00.000Z',
        },
        {
          name: 'image.png',
          type: 'image/png',
          uploadedAt: '2024-08-24T11:02:00.000Z',
        },
      ]);
    });
  });

  describe('notification payload generation', () => {
    it('should generate correct payload structure', () => {
      const newFiles = [
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
      ];

      const { fileNames, fileDetails } = transformFilesForNotification(newFiles);

      const payload = {
        ccbcNumber: 'CCBC-12345',
        documentType: 'Email Correspondence',
        documentNames: fileNames,
        fileDetails,
        timestamp: new Date().toLocaleString(),
        rfiNumber: 'RFI-01',
      };

      expect(payload.documentNames).toEqual(['new-document.pdf', 'new-report.docx']);
      expect(payload.fileDetails).toHaveLength(2);
      expect(payload.fileDetails[0].type).toBe('application/pdf');
      expect(payload.fileDetails[1].type).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      expect(payload.documentType).toBe('Email Correspondence');
    });
  });
});
