import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationHeaderTestQuery,
} from '__generated__/ApplicationHeaderTestQuery.graphql';
import { screen } from '@testing-library/react';
import ApplicationHeader from 'components/Analyst/ApplicationHeader';
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
        formData: {
          jsonData: {},
          formByFormSchemaId: {
            jsonSchema: {},
          },
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
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<ApplicationHeaderTestQuery>({
    component: ApplicationHeader,
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
    expect(applicationHeader).toHaveStyle({ padding: '8px 12px' });
    expect(applicationHeader).toHaveStyle({ marginBottom: '40px' });
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
});
