import { screen, within, fireEvent, act } from '@testing-library/react';
import mockFormData from 'tests/utils/mockFormData';
import { acknowledgementsEnum } from 'formSchema/pages/acknowledgements';
import sharedReviewThemeTests from 'tests/components/Review/ReviewTheme';
import { schema } from 'formSchema';
import * as moduleApi from '@growthbook/growthbook-react';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import Application from '../../../../pages/analyst/application/[applicationId]';
import compiledApplicationIdQuery, {
  ApplicationIdQuery,
} from '../../../../__generated__/ApplicationIdQuery.graphql';

const mockShowLeadColumn: moduleApi.FeatureResult<boolean> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_lead',
};

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        ccbcNumber: 'CCBC-10001',
        organizationName: 'test org',
        projectName: 'test project',
        formData: {
          jsonData: mockFormData,
          formByFormSchemaId: {
            jsonSchema: schema,
          },
        },
        applicationRfiDataByApplicationId: {
          edges: [
            {
              node: {
                rfiDataByRfiDataId: {
                  jsonData: {
                    rfiType: ['Missing files or information'],
                    rfiDueBy: '2023-08-05',
                    rfiAdditionalFiles: {
                      geographicCoverageMap: [
                        {
                          id: 35,
                          name: 'rfi-test-file.kmz',
                          size: 1000000,
                          type: '',
                          uuid: '6c5328e2-2c64-4de1-921f-a289f57c1106',
                        },
                      ],
                      geographicCoverageMapRfi: true,
                      eligibilityAndImpactsCalculator: [
                        {
                          id: 34,
                          name: 'rfi-test-file-2.kmz',
                          size: 1000000,
                          type: '',
                          uuid: '6287fd27-3994-4bf9-9a6b-2ad6d7b95abb',
                        },
                      ],
                      eligibilityAndImpactsCalculatorRfi: true,
                    },
                  },
                  id: 'WyJyZmlfZGF0YSIsNV0=',
                  rowId: 5,
                  rfiNumber: 'CCBC-030004-2',
                },
              },
            },
          ],
        },
        status: 'received',
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      allAnalysts: {
        nodes: [
          {
            rowId: 1,
            givenName: 'Test',
            familyName: '1',
          },
          {
            rowId: 2,
            givenName: 'Test',
            familyName: '2',
          },
        ],
      },
    };
  },
};

const mockEmptyFormDataPayload = {
  Query() {
    return {
      applicationByRowId: {
        applicationByRowId: {
          ccbcNumber: 'CCBC-10001',
          organizationName: 'test org',
          projectName: 'test project',
        },
        formData: {
          jsonData: {},
          formByFormSchemaId: {
            jsonSchema: schema,
          },
        },
        status: 'received',
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<ApplicationIdQuery>({
  pageComponent: Application,
  compiledQuery: compiledApplicationIdQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The analyst view application page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1' },
    });
  });

  // Tests for the Review theme that are shared with the review page and analyst application view
  sharedReviewThemeTests((payload) => {
    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();
  });

  it('displays the correct nav links when user is logged in', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', { name: 'test project' })
    ).toBeInTheDocument();
  });

  it('should have correct extra sections', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByRole('heading', { name: 'Review' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Acknowledgements' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Submission' })
    ).toBeInTheDocument();
  });

  it('should have the correct error in the Review section if form checkbox not checked', () => {
    pageTestingHelper.loadQuery(mockEmptyFormDataPayload);
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Review' }).closest('section')
    );

    expect(
      section
        .getAllByText(
          'By checking this box, you acknowledge that there are incomplete fields and incomplete applications may not be assessed. If the incomplete fields are not applicable to you, please check the box and continue to the acknowledgements page.'
        )[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveStyle('background-color: rgba(248, 214, 203, 0.4)');
  });

  it('should have the correct value in the Review section if form checkbox is checked', () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
              jsonData: {
                review: {
                  acknowledgeIncomplete: true,
                },
              },
            },
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };
    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Review' }).closest('section')
    );

    expect(
      section
        .getAllByText(
          'By checking this box, you acknowledge that there are incomplete fields and incomplete applications may not be assessed. If the incomplete fields are not applicable to you, please check the box and continue to the acknowledgements page.'
        )[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');
  });

  it('should have the correct message in the Review section if form has no validation errors', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Review' }).closest('section')
    );

    expect(
      section.getByText('All mandatory fields are filled')
    ).toBeInTheDocument();
  });

  it('should have correct fields in Acknowledgements section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen
        .getByRole('heading', { name: 'Acknowledgements' })
        .closest('section')
    );

    for (let i = 0; i < acknowledgementsEnum.length; i += 1) {
      expect(
        section
          .getAllByText(acknowledgementsEnum[i])[0]
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('Yes');
    }
  });

  it('should the correct fields in the Submission section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Submission' }).closest('section')
    );

    expect(
      section
        .getAllByText('Completed for (Legal organization name)')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionCompletedFor);

    expect(
      section
        .getAllByText('Completed by')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionCompletedBy);

    expect(
      section.getByText('Title').closest('tr').getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionTitle);

    expect(
      section
        .getAllByText('On this date (YYYY-MM-DD)')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionDate);
  });

  it('should show the assign lead dropdown', () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowLeadColumn);
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByRole('option', { name: 'Lead' })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('option', { name: 'Test 1' })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('option', { name: 'Test 2' })[0]
    ).toBeInTheDocument();
  });

  it('expand all is visible on this page', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('button', {
        name: 'Expand all',
      })
    ).toBeInTheDocument();
  });

  it('collapse all is visible on this page', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('button', {
        name: 'Collapse all',
      })
    ).toBeInTheDocument();
  });

  it('collapse all makes all accordion elements collapse', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const collapseButton = screen.getByRole('button', {
      name: 'Collapse all',
    });
    act(() => {
      fireEvent.click(collapseButton);
    });
    // All accordions contain a table, so to find every collapsed portion we select them all
    const allHiddenDivs = screen
      .getAllByRole('table', {
        hidden: true,
      })
      .map((tableElement) => tableElement.parentElement);

    // attempt to find a div that would not be hidden
    const isAllHidden = allHiddenDivs.find((section) => {
      return section.style.display !== 'none';
    });
    // expect not to find one
    expect(isAllHidden).toBeUndefined();
  });

  it('handles quarantined links appropriately for analysts', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ avstatus: 'dirty' }),
      })
    ) as jest.Mock;
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const expandAllButton = screen.getByRole('button', {
      name: 'Expand all',
    });

    await act(() => {
      fireEvent.click(expandAllButton);
    });

    const downloadLink = screen.getAllByTestId('history-attachment-link')[16];
    expect(downloadLink).toBeVisible();

    jest.spyOn(window, 'alert').mockImplementation(() => window);

    await act(async () => {
      fireEvent.click(downloadLink);
    });

    expect(window.alert).toHaveBeenCalledWith(
      'An error occurred when downloading the file. Contact the CCBC Portal administrator'
    );

    // after clicking link should no longer be visible
    expect(downloadLink).not.toBeVisible();
  });

  it('shows and hides the status info modal', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const infoButton = screen.getByTestId('status-information-icon');

    await act(() => {
      fireEvent.click(infoButton);
    });

    expect(screen.getByText('Other statuses')).toBeVisible();

    const closeButton = screen.getByTestId('close-button');

    await act(() => {
      fireEvent.click(closeButton);
    });

    expect(screen.getByText('Other statuses')).not.toBeVisible();

    await act(() => {
      fireEvent.keyDown(infoButton, { key: 'Enter' });
    });

    expect(screen.getByText('Other statuses')).toBeVisible();

    await act(() => {
      fireEvent.keyDown(closeButton, { key: 'Escape' });
    });

    expect(screen.getByText('Other statuses')).not.toBeVisible();
  });

  it('displays the rfi files', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('rfi-test-file.kmz')).toBeInTheDocument();
    expect(screen.getByText('rfi-test-file-2.kmz')).toBeInTheDocument();
  });

  it('displays the star icon for rfi file', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByTestId('rfi-star-icon')[0]).toBeInTheDocument();
  });
});
