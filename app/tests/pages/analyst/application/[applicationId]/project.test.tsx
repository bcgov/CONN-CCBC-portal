import { fireEvent, screen } from '@testing-library/react';
import { act } from 'react';
import * as moduleApi from '@growthbook/growthbook-react';
import { FeatureResult, JSONValue } from '@growthbook/growthbook-react';
import Project from 'pages/analyst/application/[applicationId]/project';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledProjectQuery, {
  projectQuery,
} from '__generated__/projectQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        rowId: 1,
        amendmentNumbers: '0 1 2 3',
        ccbcNumber: 'CCBC-010003',
        allApplications: {
          nodes: [
            {
              ccbcNumber: 'CCBC-010001',
              rowId: 1,
            },
            {
              ccbcNumber: 'CCBC-010002',
              rowId: 2,
            },
            {
              ccbcNumber: 'CCBC-010003',
              rowId: 3,
            },
          ],
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const mockJsonDataQueryPayload = {
  Query() {
    return {
      allApplications: {
        nodes: [
          {
            ccbcNumber: 'CCBC-010001',
            rowId: 1,
          },
          {
            ccbcNumber: 'CCBC-010002',
            rowId: 2,
          },
          {
            ccbcNumber: 'CCBC-010003',
            rowId: 3,
          },
        ],
      },
      applicationByRowId: {
        id: 'TestApplicationId',
        rowId: 1,
        ccbcNumber: '123456789',
        announcements: {
          edges: [
            {
              node: {
                id: 'WyJhbm5vdW5jZE1lbnRzIiwrNF2=',
                jsonData: {
                  announcementUrl: 'www.test.com',
                  announcementDate: '2023-05-01',
                  announcementType: 'Primary',
                  otherProjectsInAnnouncement: [
                    { ccbcNumber: 'CCBC-010001' },
                    { ccbcNumber: 'CCBC-010002' },
                  ],
                },
                rowId: 1,
              },
            },
            {
              node: {
                id: 'WyJhbm5vdW5jZW1lbnRzIiwxNF0=',
                jsonData: {
                  announcementUrl: 'www.test-2.com',
                  announcementDate: '2023-05-02',
                  announcementType: 'Secondary',
                },
                rowId: 2,
              },
            },
            {
              node: {
                id: 'WyJhbm5vdW5jZW1lbnRzIiwxNF1=',
                jsonData: {
                  announcementUrl: 'www.test-3.com',
                  announcementDate: '2023-05-03',
                  announcementType: 'Secondary',
                  previewed: true,
                  preview: {
                    image: '/images/noPreview.png',
                    title: 'Test title',
                    description: 'Test description',
                  },
                },
                rowId: 3,
              },
            },
          ],
          __id: 'client:WyJhcHBsaWNhdGlvbnMiLDZd:__AnnouncementsForm_announcements_connection',
        },
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<projectQuery>({
  pageComponent: Project,
  compiledQuery: compiledProjectQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

const mockShowAnnouncement: FeatureResult<JSONValue> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_announcement',
};

jest.setTimeout(10000000);

describe('The Project page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1' },
    });
    jest.spyOn(moduleApi, 'useFeature').mockImplementation(() => {
      return mockShowAnnouncement;
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            title: null,
            description: 'No preview available',
            image: '/images/noPreview.png',
          }),
      })
    ) as jest.Mock;
  });

  it('should show the announcements', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
      pageTestingHelper.renderPage();
    });

    const expandButton =
      screen.getAllByTestId('accordion-icon')[1].parentElement;

    act(() => {
      fireEvent.click(expandButton);
    });

    expect(screen.getByText('Primary news release')).toBeInTheDocument();
    expect(screen.getByText('Secondary news releases')).toBeInTheDocument();

    // [VB] commented out until 1397 is done
    // expect(screen.getByText('www.test.com')).toBeInTheDocument();
    // expect(screen.getByText('www.test-2.com')).toBeInTheDocument();

    expect(screen.getByText('May 01, 2023')).toBeInTheDocument();
    expect(screen.getByText('May 02, 2023')).toBeInTheDocument();
    expect(screen.getByText('May 03, 2023')).toBeInTheDocument();
  });

  it('should show the error message for invalid url', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const expandButton =
      screen.getAllByTestId('accordion-icon')[1].parentElement;

    act(() => {
      fireEvent.click(expandButton);
    });

    const editButton = screen.getByText('Add announcement');

    await act(async () => {
      fireEvent.click(editButton);
    });

    const announcementUrl = screen.getByTestId('root_announcementUrl');

    expect(announcementUrl).toHaveStyle('border: 2px solid #606060;');

    await act(async () => {
      fireEvent.change(announcementUrl, {
        target: { value: 'invalid url' },
      });
    });

    expect(
      screen.getByText('Invalid URL. Please copy and paste from your browser.')
    ).toBeInTheDocument();

    expect(announcementUrl).toHaveStyle('border: 2px solid #E71F1F;');
  });

  it('should highlight the missing form fields', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const expandButton =
      screen.getAllByTestId('accordion-icon')[1].parentElement;

    act(() => {
      fireEvent.click(expandButton);
    });

    const editButton = screen.getByText('Add announcement');

    await act(async () => {
      fireEvent.click(editButton);
    });

    const saveButton = screen.getByText('Save');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    const announcementUrl = screen.getByTestId('root_announcementUrl');
    const announcementType = screen
      .getByTestId('root_announcementType')
      .closest('div');
    const announcementDate = screen.getAllByTestId(
      'datepicker-widget-container'
    )[0].children[0].children[0].children[2];

    expect(announcementUrl).toHaveStyle('border: 2px solid #E71F1F;');
    expect(announcementType).toHaveStyle('border: 2px solid #E71F1F;');
    expect(announcementDate).toHaveStyle('border: 2px solid #E71F1F;');
  });

  it('should send the updateAnnouncement mutation instead of createAnnouncement when updating an existing announcement', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
      pageTestingHelper.renderPage();
    });

    const expandButton =
      screen.getAllByTestId('accordion-icon')[1].parentElement;

    act(() => {
      fireEvent.click(expandButton);
    });

    // Click on the edit button to open the form for the first announcement
    const editButton = screen.getAllByTestId('project-form-edit-button')[1];
    await act(async () => {
      fireEvent.click(editButton);
    });

    // Change the announcement URL
    const announcementUrl = screen.getByTestId('root_announcementUrl');
    await act(async () => {
      fireEvent.change(announcementUrl, {
        target: { value: 'https://www.bc.com' },
      });
    });

    // Save the announcement
    const saveButton = screen.getByTestId('save-announcement');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    // Check if the updateAnnouncement mutation has been sent instead of createAnnouncement
    pageTestingHelper.expectMutationToBeCalled('updateAnnouncementMutation', {
      input: {
        jsonData: {
          announcementUrl: 'https://www.bc.com',
          announcementDate: '2023-05-01',
          announcementType: 'Primary',
          otherProjectsInAnnouncement: [
            {
              ccbcNumber: 'CCBC-010001',
            },
            {
              ccbcNumber: 'CCBC-010002',
            },
          ],
          previewed: false,
        },
        projectNumbers: 'CCBC-010001,CCBC-010002',
        oldRowId: 1,
      },
    });
  });

  it('should call the deleteAnnouncement mutation for multi project', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
      pageTestingHelper.renderPage();
    });

    const expandButton =
      screen.getAllByTestId('accordion-icon')[1].parentElement;

    act(() => {
      fireEvent.click(expandButton);
    });

    // Click on the delete button to open the form for the first announcement
    const deleteButton = screen.getAllByTestId('project-form-delete-button')[0];
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // observe confirmation dialog
    expect(screen.getByText('Delete from all projects')).toBeInTheDocument();
    expect(screen.getByText('Remove from this project')).toBeInTheDocument();

    // delete the announcement
    const deleteFromAll = screen.getByTestId('delete-from-all-btn');
    await act(async () => {
      fireEvent.click(deleteFromAll);
    });

    // Check if the deleteAnnouncement mutation has been sent
    pageTestingHelper.expectMutationToBeCalled('deleteAnnouncementMutation', {
      input: {
        announcementRowId: 1,
        applicationRowId: -1,
        formData: {
          announcementUrl: 'www.test.com',
          announcementDate: '2023-05-01',
          announcementType: 'Primary',
          otherProjectsInAnnouncement: [
            {
              ccbcNumber: 'CCBC-010001',
            },
            {
              ccbcNumber: 'CCBC-010002',
            },
          ],
        },
      },
    });

    // delete the announcement
    const deleteFromThis = screen.getByTestId('delete-from-this-btn');
    await act(async () => {
      fireEvent.click(deleteFromThis);
    });

    // Check if the deleteAnnouncement mutation has been sent
    pageTestingHelper.expectMutationToBeCalled('deleteAnnouncementMutation', {
      input: {
        announcementRowId: 1,
        applicationRowId: -1,
        formData: {
          announcementUrl: 'www.test.com',
          announcementDate: '2023-05-01',
          announcementType: 'Primary',
          otherProjectsInAnnouncement: [
            {
              ccbcNumber: 'CCBC-010001',
            },
            {
              ccbcNumber: 'CCBC-010002',
            },
          ],
        },
      },
    });
  });

  it('should call the deleteAnnouncement mutation for single project', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
      pageTestingHelper.renderPage();
    });

    const expandButton =
      screen.getAllByTestId('accordion-icon')[1].parentElement;

    act(() => {
      fireEvent.click(expandButton);
    });

    // Click on the delete button to open the form for the first announcement
    const deleteButton = screen.getAllByTestId('project-form-delete-button')[1];
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // observe confirmation dialog
    expect(screen.getByText('Yes, delete')).toBeInTheDocument();
    expect(screen.getByText('No, Cancel')).toBeInTheDocument();

    // delete the announcement
    const deleteFromAll = screen.getByTestId('delete-from-this-btn');
    await act(async () => {
      fireEvent.click(deleteFromAll);
    });

    // Check if the deleteAnnouncement mutation has been sent
    pageTestingHelper.expectMutationToBeCalled('deleteAnnouncementMutation', {
      input: {
        announcementRowId: 2,
        applicationRowId: 1,
        formData: {
          announcementUrl: 'www.test-2.com',
          announcementDate: '2023-05-02',
          announcementType: 'Secondary',
        },
      },
    });

    // delete the announcement
    const deleteFromThis = screen.getByTestId('delete-from-this-btn');
    await act(async () => {
      fireEvent.click(deleteFromThis);
    });

    // Check if the deleteAnnouncement mutation has been sent
    pageTestingHelper.expectMutationToBeCalled('deleteAnnouncementMutation', {
      input: {
        announcementRowId: 2,
        applicationRowId: 1,
        formData: {
          announcementUrl: 'www.test-2.com',
          announcementDate: '2023-05-02',
          announcementType: 'Secondary',
        },
      },
    });
  });

  it('should expand conditional approval sections if query is set', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1', section: 'conditionalApproval' },
    });

    await act(async () => {
      pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
      pageTestingHelper.renderPage();
    });

    expect(screen.getByText('Conditional approval')).toBeInTheDocument();
  });

  it('should expand project information (sow) sections if query is set', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1', section: 'projectInformation' },
    });

    await act(async () => {
      pageTestingHelper.loadQuery(mockJsonDataQueryPayload);
      pageTestingHelper.renderPage();
    });

    expect(
      screen.getByText('Funding agreement, statement of work, & map')
    ).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
