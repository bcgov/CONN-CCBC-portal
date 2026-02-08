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