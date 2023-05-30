import ProjectInformationForm from 'components/Analyst/Project/ProjectInformation/ProjectInformationForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  SowImportFileWidgetTestQuery,
} from '__generated__/SowImportFileWidgetTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import { schema } from 'formSchema';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';

const testQuery = graphql`
  query SowImportFileWidgetTestQuery {
    # Spread the fragment you want to test here
    application(id: "TestApplicationID") {
      ...ProjectInformationForm_application
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'testId',
      rowId: 1,
      projectInformation: {
        id: 'testId',
        jsonData: null,
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<SowImportFileWidgetTestQuery>({
    component: ProjectInformationForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
    }),
  });

describe('The SowImportFileWidget', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
    componentTestingHelper.setMockRouterValues({
      query: { id: '1' },
    });
  });

  it('should render the file widget description', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    expect(hasFundingAggreementBeenSigned).not.toBeChecked();

    await act(async () => {
      fireEvent.click(hasFundingAggreementBeenSigned);
    });

    expect(
      screen.getByText('Upload the completed statement of work tables')
    ).toBeInTheDocument();
  });

  it('calls createAttachmentMutation and renders the filename and correct button label', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const file = new File([new ArrayBuffer(1)], 'file.kmz', {
      type: 'application/vnd.google-earth.kmz',
    });

    const inputFile = screen.getAllByTestId('file-test')[0];

    fireEvent.change(inputFile, { target: { files: [file] } });

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

    expect(screen.getByText('Replace')).toBeVisible();
    expect(screen.getByText('file.kmz')).toBeVisible();
  });

  it('calls deleteAttachmentMutation and renders the correct filename and button label', async () => {
    componentTestingHelper.loadQuery({
      ...mockQueryPayload,
      Application() {
        return {
          id: 'TestApplicationID',
          projectInformation: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            jsonData: {
              main: {
                upload: {
                  fundingAgreementUpload: [
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

  it('displays an error message when attempting to upload incorrect file type', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const file = new File([new ArrayBuffer(1)], 'image.png', {
      type: 'image/png',
    });

    const inputFile = screen.getAllByTestId('file-test')[0];

    fireEvent.change(inputFile, { target: { files: [file] } });

    expect(
      screen.getByText(
        'Please use an accepted file type. Accepted types for this field are:'
      )
    ).toBeVisible();
  });

  // it('displays an error message when the createAttachment mutation fails', () => {
  //   componentTestingHelper.loadQuery();
  //   componentTestingHelper.renderComponent();
  //
  //   const file = new File([new ArrayBuffer(1)], 'file.kmz', {
  //     type: 'application/vnd.google-earth.kmz',
  //   });
  //
  //   const inputFile = screen.getAllByTestId('file-test')[0];
  //
  //   fireEvent.change(inputFile, { target: { files: [file] } });
  //
  //   act(() =>
  //     componentTestingHelper.environment.mock.rejectMostRecentOperation(
  //       new Error()
  //     )
  //   );
  //
  //   expect(screen.getByText(/File failed to upload/)).toBeVisible();
  // });

  // it('displays an error message when the deleteAttachment mutation fails', async () => {
  //   componentTestingHelper.loadQuery({
  //     ...mockQueryPayload,
  //     Application() {
  //       return {
  //         id: 'TestApplicationID',
  //         formData: {
  //           jsonData: {
  //             coverage: {
  //               coverageAssessmentStatistics: [
  //                 {
  //                   id: 3,
  //                   uuid: 'a365945b-5631-4e52-af9f-515e6fdcf614',
  //                   name: 'file-2.kmz',
  //                   size: 0,
  //                   type: 'application/vnd.google-earth.kmz',
  //                 },
  //               ],
  //             },
  //           },
  //           formByFormSchemaId: {
  //             jsonSchema: schema,
  //           },
  //         },
  //         status: 'draft',
  //       };
  //     },
  //   });
  //   componentTestingHelper.renderComponent();
  //
  //   expect(screen.getByText('file-2.kmz')).toBeVisible();
  //   expect(screen.getByText('Replace')).toBeVisible();
  //
  //   const deleteButton = screen.getByTestId('file-delete-btn');
  //
  //   deleteButton.click();
  //
  //   act(() => {
  //     componentTestingHelper.environment.mock.rejectMostRecentOperation(
  //       new Error()
  //     );
  //   });
  //
  //   expect(screen.getByText('file-2.kmz')).toBeVisible();
  //   expect(screen.getByText('Replace')).toBeVisible();
  //   expect(screen.getByText(/Delete file failed/)).toBeVisible();
  // });

  // it('File Widget gets application id from url', async () => {
  //   componentTestingHelper.loadQuery();
  //   componentTestingHelper.renderComponent();
  //
  //   const applicationId = '5';
  //   componentTestingHelper.router.query.id = null;
  //   componentTestingHelper.router.query.applicationId = applicationId;
  //
  //   const file = new File([new ArrayBuffer(1)], 'file.kmz', {
  //     type: 'application/vnd.google-earth.kmz',
  //   });
  //
  //   const inputFile = screen.getAllByTestId('file-test')[0];
  //
  //   fireEvent.change(inputFile, { target: { files: [file] } });
  //
  //   componentTestingHelper.expectMutationToBeCalled(
  //     'createAttachmentMutation',
  //     {
  //       input: {
  //         attachment: {
  //           file,
  //           fileName: 'file.kmz',
  //           fileSize: '1 Bytes',
  //           fileType: 'application/vnd.google-earth.kmz',
  //           applicationId: parseInt(applicationId, 10),
  //         },
  //       },
  //     }
  //   );
  // });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
