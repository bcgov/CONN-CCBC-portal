import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as moduleApi from '@growthbook/growthbook-react';
import { FeatureResult, JSONValue } from '@growthbook/growthbook-react';
import GISAssessment from 'pages/analyst/application/[applicationId]/assessments/gis';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledGisAssessmentsQuery, {
  gisAssessmentQuery,
} from '__generated__/gisAssessmentQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      applicationByRowId: {
        rowId: 1,
        assessmentForm: {
          jsonData: {},
          createdAt: '2023-03-27T12:44:09.882871-07:00',
        },
        status: 'received',
        gisData: {
          jsonData: {
            ccbc_number: 'CCBC-010001',
            GIS_TOTAL_HH: 10.01,
            GIS_TOTAL_INDIG_HH: 20.1,
            GIS_PERCENT_OVERLAP: 30.2,
            GIS_PERCENT_OVERBUILD: 40.3,
            GIS_TOTAL_ELIGIBLE_HH: 50.4,
            GIS_TOTAL_INELIGIBLE_HH: 60.5,
            GIS_TOTAL_ELIGIBLE_INDIG_HH: 70.6,
          },
          createdAt: '2023-04-25T12:38:16.342915-07:00',
        },
        formData: {
          jsonData: {},
        },
        gisAssessmentHh: {
          eligible: 2.12,
          eligibleIndigenous: 212,
        },
      },

      allApplicationStatusTypes: {
        ...allApplicationStatusTypes,
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

const pageTestingHelper = new PageTestingHelper<gisAssessmentQuery>({
  pageComponent: GISAssessment,
  compiledQuery: compiledGisAssessmentsQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

const mockShowApplicationGisData: FeatureResult<JSONValue> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_application_gis_data',
};

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      asPath: '/analyst/application/1/assessments/gis',
      query: { applicationId: '1' },
    });
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowApplicationGisData);
  });

  it('highlights the correct nav tab', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tab = screen.getByRole('link', { name: 'GIS' });

    expect(tab).toBeVisible();
    expect(tab).toHaveStyle('font-weight: 700;');
  });

  it('Displays the form', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByLabelText('Assigned to')).toBeInTheDocument();
    expect(screen.getByLabelText('Target date')).toBeInTheDocument();
    expect(screen.getByText('Not started')).toBeInTheDocument();
    expect(screen.getByText('Needs RFI')).toBeInTheDocument();
    expect(screen.getByText('Needs 2nd review')).toBeInTheDocument();
    expect(screen.getByText('Assessment complete')).toBeInTheDocument();
  });

  it('fills the form and calls the create assessment mutation when saved', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const commentsOnCoverageData = screen.getByTestId(
      'root_commentsOnCoverageData'
    );
    const commentsOnHouseholdCounts = screen.getByTestId(
      'root_commentsOnHouseholdCounts'
    );
    const commentsOnOverbuild = screen.getByTestId('root_commentsOnOverbuild');
    const commentsOnOverlap = screen.getByTestId('root_commentsOnOverlap');

    await act(async () => {
      fireEvent.change(commentsOnCoverageData, {
        target: { value: 'test 1' },
      });
      fireEvent.change(commentsOnHouseholdCounts, {
        target: { value: 'test 2' },
      });
      fireEvent.change(commentsOnOverbuild, {
        target: { value: 'test 3' },
      });
      fireEvent.change(commentsOnOverlap, {
        target: { value: 'test 4' },
      });
    });

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    pageTestingHelper.expectMutationToBeCalled('createAssessmentMutation', {
      input: {
        _applicationId: 1,
        _jsonData: {
          nextStep: 'Not started',
          commentsOnCoverageData: 'test 1',
          commentsOnHouseholdCounts: 'test 2',
          commentsOnOverbuild: 'test 3',
          commentsOnOverlap: 'test 4',
        },
        _dependenciesData: null,
        _assessmentType: 'gis',
      },
      connections: [],
    });
  });

  it('Displays the last updated datetime', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('last-updated')).toHaveTextContent(
      'Last updated: Mar 27, 2023, 12:44 p.m.'
    );
  });

  it('Displays the last updated GIS datetime', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText('GIS analysis last updated: Apr 25, 2023, 12:38 p.m.')
    ).toBeInTheDocument();
  });

  it('Displays the GIS data', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('10.01')).toBeInTheDocument();
    expect(screen.getByText('20.1')).toBeInTheDocument();
    expect(screen.getByText('30.2')).toBeInTheDocument();
    expect(screen.getByText('40.3')).toBeInTheDocument();
    expect(screen.getByText('50.4')).toBeInTheDocument();
    expect(screen.getByText('60.5')).toBeInTheDocument();
    expect(screen.getByText('70.6')).toBeInTheDocument();
  });

  it('Displays the GIS assessment HH data', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const eligibleInput = screen.getByDisplayValue(2.12);
    const eligibleIndigenousInput = screen.getByDisplayValue(212);

    expect(eligibleInput).toHaveValue(2.12);
    expect(eligibleIndigenousInput).toHaveValue(212);
  });

  it('Calls the saveGisAssessmentHh mutation on change for eligible hh', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const eligibleInput = screen.getByDisplayValue(2.12);
    await act(async () => {
      fireEvent.change(eligibleInput, {
        target: { value: '3.17' },
      });
    });

    pageTestingHelper.expectMutationToBeCalled('saveGisAssessmentHhMutation', {
      input: {
        _applicationId: 1,
        _eligible: 3.17,
        _eligibleIndigenous: 212,
      },
    });
  });

  it('Calls the saveGisAssessmentHh mutation on change for eligible indigenous hh', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const eligibleIndigenousInput = screen.getByDisplayValue(212);

    await act(async () => {
      fireEvent.change(eligibleIndigenousInput, {
        target: { value: '50.5' },
      });
    });

    pageTestingHelper.expectMutationToBeCalled('saveGisAssessmentHhMutation', {
      input: {
        _applicationId: 1,
        _eligible: 2.12,
        _eligibleIndigenous: 50.5,
      },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
