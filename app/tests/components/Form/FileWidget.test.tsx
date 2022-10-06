import ApplicationForm from 'components/Form/ApplicationForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  FileWidgetTestQuery,
} from '__generated__/FileWidgetTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import getFormPage from 'utils/getFormPage';
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
      formData: {},
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
    pageNumber: getFormPage('coverage'),
    query: data.query,
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
          formData: {
            formData: {
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

    act(() => {
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
    });

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
            formData: {
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

    fireEvent.change(inputFile, { target: { files: [file] } });

    expect(
      screen.getByText(
        'Please use an accepted file type. Accepted types for this field are:'
      )
    ).toBeVisible();
  });
});
