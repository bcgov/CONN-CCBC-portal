import CommunityProgressReportForm from 'components/Analyst/Project/CommunityProgressReport/CommunityProgressReportForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';

const testQuery = graphql`
  query CommunityProgressReportFormTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    application(id: "TestApplicationId") {
      ...CommunityProgressReportForm_application
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationId',
      rowId: 1,
      ccbcNumber: '123456789',
      applicationCommunityProgressReportDataByApplicationId: {
        edges: [],
      },
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

const componentTestingHelper =
  new ComponentTestingHelper<ApplicationFormTestQuery>({
    component: CommunityProgressReportForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
    }),
  });

describe('The Community Progress Report form', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('displays the form', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Community progress report' })
    ).toBeVisible();

    expect(
      screen.getByText('Add community progress report')
    ).toBeInTheDocument();
  });

  it('Uploads a Community Progress Report', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );

    const addButton = screen
      .getByText('Add community progress report')
      .closest('button');

    await act(async () => {
      fireEvent.click(addButton);
    });

    const file = new File([new ArrayBuffer(1)], 'file.xls', {
      type: 'application/vnd.ms-excel',
    });

    const inputFile = screen.getByTestId('file-test');

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
      name: 'Save & Import',
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createCommunityProgressReportMutation',
      {
        input: {
          applicationCommunityProgressReportData: {
            jsonData: {
              progressReportFile: [
                {
                  id: 1,
                  uuid: 'string',
                  name: 'file.xls',
                  size: 1,
                  type: 'application/vnd.ms-excel',
                },
              ],
            },
            applicationId: 1,
          },
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createCommunityProgressReportData: {
            changeRequest: {
              rowId: 1,
            },
          },
        },
      });
    });
  });
});
