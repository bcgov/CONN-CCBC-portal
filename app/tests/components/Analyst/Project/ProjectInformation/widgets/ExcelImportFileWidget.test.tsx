import ProjectInformationForm from 'components/Analyst/Project/ProjectInformation/ProjectInformationForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  ExcelImportFileWidgetTestQuery,
} from '__generated__/ExcelImportFileWidgetTestQuery.graphql';
import { act, fireEvent, screen, render } from '@testing-library/react';
import { schema } from 'formSchema';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';
import {
  Success,
  renderStatusLabel,
} from 'components/Analyst/Project/ProjectInformation/widgets/ExcelImportFileWidget';
import GlobalTheme from 'styles/GlobalTheme';

const testQuery = graphql`
  query ExcelImportFileWidgetTestQuery {
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

const mockFormDataPayload = {
  Application() {
    return {
      id: 'TestApplicationID',
      projectInformation: {
        formByFormSchemaId: {
          jsonSchema: schema,
        },
        jsonData: {
          hasFundingAgreementBeenSigned: true,
          statementOfWorkUpload: [
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
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<ExcelImportFileWidgetTestQuery>({
    component: ProjectInformationForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
    }),
  });

describe('The ExcelImportFileWidget', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => {} })
    );
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
      screen.getByText('Upload the completed SOW')
    ).toBeInTheDocument();
  });

  it('calls createAttachmentMutation and renders the filename and correct button label', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    expect(hasFundingAggreementBeenSigned).not.toBeChecked();

    await act(async () => {
      fireEvent.click(hasFundingAggreementBeenSigned);
    });

    const file = new File([new ArrayBuffer(1)], 'file.xlsx', {
      type: 'application/excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[1];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createAttachmentMutation',
      {
        input: {
          attachment: {
            file,
            fileName: 'file.xlsx',
            fileSize: '1 Bytes',
            fileType: 'application/excel',
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
    expect(screen.getByText('file.xlsx')).toBeInTheDocument();
    expect(
      screen.getByText('Statement of Work Data table match database')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Remember to press Save & Import')
    ).toBeInTheDocument();
  });

  it('calls deleteAttachmentMutation and renders the correct filename and button label', async () => {
    componentTestingHelper.loadQuery(mockFormDataPayload);
    componentTestingHelper.renderComponent();

    const editButton = screen.getAllByTestId('project-form-edit-button')[2];

    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(screen.getAllByText('file-2.kmz')[0]).toBeInTheDocument();
    expect(screen.getByText('Replace')).toBeInTheDocument();

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

    expect(screen.queryByText('Replace')).toBeNull();
  });

  it('handles invalid file upload', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    expect(hasFundingAggreementBeenSigned).not.toBeChecked();

    await act(async () => {
      fireEvent.click(hasFundingAggreementBeenSigned);
    });

    const file = new File([new ArrayBuffer(1)], 'file.doc', {
      type: 'application/word',
    });

    const inputFile = screen.getAllByTestId('file-test')[1];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    expect(
      screen.getByText(/Please use an accepted file type/)
    ).toBeInTheDocument();
  });

  it('handles errors from sow validation', async () => {
    const mockErrorList = [
      { level: 'summary', error: 'Error 1', filename: 'test.txt' },
      { level: 'tab', error: 'Error 2', filename: 'test.txt' },
    ];
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 400, json: () => mockErrorList })
    );
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const hasFundingAggreementBeenSigned = screen.getByLabelText('Yes');

    expect(hasFundingAggreementBeenSigned).not.toBeChecked();

    await act(async () => {
      fireEvent.click(hasFundingAggreementBeenSigned);
    });

    const file = new File([new ArrayBuffer(1)], 'file.xlsx', {
      type: 'application/excel',
    });

    const inputFile = screen.getAllByTestId('file-test')[1];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    expect(
      screen.getByText(
        'Statement of Work import failed, please check the file and try again'
      )
    ).toBeInTheDocument();
  });

  it('renders success text heading and subheading', () => {
    const { getByText } = render(
      <GlobalTheme>
        <Success heading="Statement of Work Data table match database" />
      </GlobalTheme>
    );
    const headingElement = getByText(
      'Statement of Work Data table match database'
    );
    const subheadingElement = getByText('Remember to press Save & Import');

    expect(headingElement).toBeInTheDocument();
    expect(subheadingElement).toBeInTheDocument();
  });

  it('renders loading component when loading is true', () => {
    // Mock dependencies and setup
    const loading = true;
    const success = false;

    const { getByText } = render(
      <GlobalTheme>
        <div>{renderStatusLabel(loading, success)}</div>
      </GlobalTheme>
    );

    expect(screen.queryAllByText('file-2.kmz')[0]).toBeUndefined();
    // Call the function
    const text = getByText('Checking the data');

    // Assert
    expect(text).toBeInTheDocument();
  });

  it('renders success component when loading is false and success is true', () => {
    // Mock dependencies and setup
    const loading = false;
    const success = true;

    // Call the function
    const renderedComponent = renderStatusLabel(loading, success);

    const { getByText } = render(
      <GlobalTheme>
        <div>{renderStatusLabel(loading, success)}</div>
      </GlobalTheme>
    );

    // testing generic success header here since the custom is described in ui:options
    const headingElement = getByText('Excel Data table match database');
    const subheadingElement = getByText('Remember to press Save & Import');

    expect(headingElement).toBeInTheDocument();
    expect(subheadingElement).toBeInTheDocument();

    // Assert
    expect(renderedComponent['type']).toBe(Success);
  });

  it('returns false when loading is false and success is false', () => {
    // Mock dependencies and setup
    const loading = false;
    const success = false;

    // Call the function
    const renderedComponent = renderStatusLabel(loading, success);

    // Assert
    expect(renderedComponent).toBe(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
