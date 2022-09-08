import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event'; 
import FormPage from '../../../pages/form/[id]/[page]';
import PageTestingHelper from '../../utils/pageTestingHelper';
import compiledPageQuery, {
  PageQuery,
} from '../../../__generated__/PageQuery.graphql';
 
const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        status: 'draft',
        ccbcNumber: 'CCBC-010001',
        intakeByIntakeId: {
          ccbcIntakeNumber: 1,
          closeTimestamp: '2022-09-06T23:59:59-07:00',
        },
        projectName: 'Project testing title',
        updatedAt: '2022-08-15T16:43:28.973734-04:00',
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<PageQuery>({
  pageComponent: FormPage,
  compiledQuery: compiledPageQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The form page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '12' },
    });
  });

  it('should upload file', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();
    
    const str = "nothing fancy";
    const blob = new Blob([str]);
    const file = new File([blob], 'documents.txt', {
      type: 'application/text',
    });
    File.prototype.text = jest.fn().mockResolvedValueOnce(str);
    expect(screen.getAllByTestId('file-test')).toBeTruthy();

    const input = screen.getAllByTestId('file-test')[0];
    await user.upload(input, file);
    // expect(screen.getByRole('link', { name: 'documents.txt' })).toBeInTheDocument();
  });
});
