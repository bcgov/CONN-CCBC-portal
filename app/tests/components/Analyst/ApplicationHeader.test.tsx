import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationHeaderTestQuery,
} from '__generated__/ApplicationHeaderTestQuery.graphql';
import { act, screen, fireEvent } from '@testing-library/react';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import ApplicationHeader from 'components/Analyst/ApplicationHeader';
import * as moduleApi from '@growthbook/growthbook-react';
import ComponentTestingHelper from '../../utils/componentTestingHelper';

const testQuery = graphql`
  query ApplicationHeaderTestQuery($rowId: Int!) {
    ...ApplicationHeader_query
  }
`;

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        ccbcNumber: 'CCBC-10001',
        organizationName: 'test org',
        projectName: 'test project',
        analystStatus: 'received',
        intakeNumber: 1,
        formData: {
          jsonData: {},
          formByFormSchemaId: {
            jsonSchema: {},
          },
        },
        rowId: 1,
        applicationPackagesByApplicationId: {
          nodes: [
            {
              package: 1,
            },
          ],
        },
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
      allApplicationStatusTypes: {
        ...allApplicationStatusTypes,
      },
    };
  },
};

const mockInternalIntakeQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        ccbcNumber: 'CCBC-10001',
        organizationName: 'test org',
        projectName: 'test project',
        analystStatus: 'received',
        intakeNumber: 99,
        formData: {
          jsonData: {},
          formByFormSchemaId: {
            jsonSchema: {},
          },
        },
        rowId: 1,
        applicationPackagesByApplicationId: {
          nodes: [
            {
              package: 1,
            },
          ],
        },
        applicationProjectTypesByApplicationId: {
          nodes: [
            {
              projectType: 'lastMile',
            },
          ],
        },
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
      allApplicationStatusTypes: {
        ...allApplicationStatusTypes,
      },
    };
  },
};

const mockShowLeadColumn: moduleApi.FeatureResult<boolean> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_lead',
};

const componentTestingHelper =
  new ComponentTestingHelper<ApplicationHeaderTestQuery>({
    component: ApplicationHeader as any,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      query: data,
    }),
  });

describe('The application header component', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('displays the CCBC Number', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('CCBC-10001')).toBeInTheDocument();
  });

  it('displays the organization name', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('test org')).toBeInTheDocument();
  });

  it('displays the project name', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('test project')).toBeInTheDocument();
  });

  it('has the correct styles for the application header', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const applicationHeader =
      screen.getByText('CCBC-10001').parentElement.parentElement;

    expect(applicationHeader).toHaveStyle({ borderLeft: '4px solid #1A5A96' });
    expect(applicationHeader).toHaveStyle({ padding: '8px 12px 0px 12px' });
    expect(applicationHeader).toHaveStyle({ marginBottom: '0.5em' });
  });

  it('has the correct styles for the CCBC number', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const ccbcNumber = screen.getByText('CCBC-10001');

    expect(ccbcNumber).toHaveStyle({ fontSize: '16px' });
    expect(ccbcNumber).toHaveStyle({ fontWeight: 'bold' });
  });

  it('has the correct styles for the project name', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const projectName = screen.getByText('test project');

    expect(projectName).toHaveStyle({ fontSize: '24px' });
    expect(projectName).toHaveStyle({ fontWeight: 'bold' });
    expect(projectName).toHaveStyle({ margin: '8px 0' });
  });

  it('has the correct styles for the organization name', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const orgName = screen.getByText('test org');

    expect(orgName).toHaveStyle({ fontSize: '16px' });
    expect(orgName).toHaveStyle({ fontWeight: 'bold' });
  });

  it('displays the current application status', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('1')).toBeVisible();
  });

  it('has the list of statuses', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calls the mutation when the package is changed', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('assign-package');

    await act(async () => {
      fireEvent.change(select, { target: { value: '3' } });
    });

    componentTestingHelper.expectMutationToBeCalled('createPackageMutation', {
      input: {
        _applicationId: 1,
        _package: 3,
      },
    });
  });

  it('calls the mutation when the project type is changed', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('assign-project_type');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'lastMileAndTransport' } });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createProjectTypeMutation',
      {
        input: {
          _applicationId: 1,
          _projectType: 'lastMileAndTransport',
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createProjectType: {
            applicationProjectType: {
              projectType: 'lastMileAndTransport',
            },
          },
        },
      });
    });

    const recordSource = componentTestingHelper.environment
      .getStore()
      .getSource();
    const projectTypeValues = recordSource
      .getRecordIDs()
      .map((recordId) => recordSource.get(recordId))
      .map((record) => (record as { projectType?: string }).projectType);

    expect(projectTypeValues).toContain('lastMileAndTransport');
  });

  it('displays the header labels', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByLabelText('Internal Status')).toBeVisible();
    expect(screen.getByLabelText('External Status')).toBeVisible();
    expect(screen.getByLabelText('Package')).toBeVisible();
    expect(screen.getByLabelText('Project Type')).toBeVisible();
    expect(screen.queryByLabelText('Lead')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Pending Change Request')).toBeVisible();
  });

  it('displays the Lead column when feature enabled', () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowLeadColumn);
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByLabelText('Lead')).toBeVisible();
  });

  it('when received status application cannot go to recommendation', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const recommendationOptionInternalIntake =
      screen.getByText('Recommendation');

    expect(recommendationOptionInternalIntake).toBeDisabled();
  });

  it('when received status internal application can go to recommendation', () => {
    componentTestingHelper.loadQuery(mockInternalIntakeQueryPayload);
    componentTestingHelper.renderComponent();

    const recommendationOptionInternalIntake =
      screen.getByText('Recommendation');
    expect(recommendationOptionInternalIntake).toBeEnabled();
  });
});
