import ChangeRequestForm from 'components/Analyst/Project/ChangeRequest/ChangeRequestForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  ChangeRequestFormTestQuery,
} from '__generated__/ChangeRequestFormTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';

global.fetch = jest.fn(() => Promise.resolve({ status: 200, json: () => {} }));

const testQuery = graphql`
  query ChangeRequestFormTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    applicationByRowId(rowId: 1) {
      ...ChangeRequestForm_application
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      rowId: 1,
      ccbcNumber: 'CCBC-010001',
      projectInformation: {
        jsonData: {
          main: {
            upload: {
              statementOfWorkUpload: [
                {
                  id: 3,
                  name: 'CCBC-020118 - Statement of Work Tables - 20230517.xlsx',
                  uuid: '41ecad78-2a39-41bc-b7c6-7faf23f772f4',
                },
              ],
              fundingAgreementUpload: [
                {
                  id: 1,
                  name: 'test.xls',
                  uuid: '6ea405a8-c3df-4fa8-b6de-e38300e39482',
                },
              ],
            },
            dateFundingAgreementSigned: '2023-06-13',
          },
          hasFundingAgreementBeenSigned: true,
        },
      },
      changeRequestDataByApplicationId: {
        edges: [],
      },
    };
  },
};

const mockEmptyQueryPayload = {
  Application() {
    return {
      rowId: 1,
      ccbcNumber: 'CCBC-010001',
      projectInformation: null,
    };
  },
};

const mockFetch = Promise.resolve({
  json: () => Promise.resolve([]),
  status: 200,
});
global.fetch = jest.fn().mockImplementation(() => mockFetch);

const componentTestingHelper =
  new ComponentTestingHelper<ChangeRequestFormTestQuery>({
    component: ChangeRequestForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.applicationByRowId,
    }),
  });

describe('The Change Request form', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();

    componentTestingHelper.setMockRouterValues({
      query: { id: '1' },
    });
  });

  it('displays the title', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Change request' })
    ).toBeVisible();
  });

  it('displays the empty state if there is no project information SoW upload', () => {
    componentTestingHelper.loadQuery(mockEmptyQueryPayload);
    componentTestingHelper.renderComponent();

    expect(
      screen.getByText(
        'Change requests will be available after a funding agreement has been signed.'
      )
    ).toBeInTheDocument();
  });

  it('calls the mutation on save', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const addButton = screen.getByText('Add change request').closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const file = new File([new ArrayBuffer(1)], 'file.xls', {
      type: 'application/vnd.ms-excel',
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
            fileName: 'file.xls',
            fileSize: '1 Bytes',
            fileType: 'application/vnd.ms-excel',
            applicationId: 1,
          },
        },
      }
    );

    expect(screen.getByLabelText('loading')).toBeInTheDocument();

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

    expect(screen.getByText('Replace')).toBeInTheDocument();
    expect(screen.getByText('file.xls')).toBeInTheDocument();

    const saveButton = screen.getByRole('button', {
      name: 'Save & Import Data',
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createChangeRequestMutation',
      {
        connections: [
          'client:<Application-mock-id-1>:__ChangeRequestForm_changeRequestDataByApplicationId_connection(filter:{"archivedAt":{"isNull":true}},orderBy:"AMENDMENT_NUMBER_DESC")',
        ],
        input: {
          _applicationId: 1,
          _amendmentNumber: 1,
          _jsonData: {
            statementOfWorkUpload: [
              {
                id: 1,
                uuid: 'string',
                name: 'file.xls',
                size: 1,
                type: 'application/vnd.ms-excel',
              },
            ],
          },
        },
      }
    );
  });
});
