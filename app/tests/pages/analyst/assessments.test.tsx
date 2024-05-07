import { mocked } from 'jest-mock';
import { screen } from '@testing-library/react';
import * as moduleApi from '@growthbook/growthbook-react';
import { FeatureResult, JSONValue } from '@growthbook/growthbook-react';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import Assessments from '../../../pages/analyst/assessments';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import PageTestingHelper from '../../utils/pageTestingHelper';
import compiledAssessmentsTableQuery, {
  assessmentsTableQuery,
} from '../../../__generated__/assessmentsTableQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_analyst',
      },
      allApplications: {
        edges: [
          {
            node: {
              id: '1',
              rowId: 1,
              analystStatus: 'received',
              projectName: 'Test Proj Name',
              ccbcNumber: 'CCBC-010001',
              organizationName: 'Test Org Name',
              intakeNumber: 1,
              zones: [1],
            },
          },
        ],
      },
      allAnalysts: {
        nodes: [
          {
            rowId: 1,
            givenName: 'Test',
            familyName: '1',
          },
        ],
      },
    };
  },
};

const mockShowTable: FeatureResult<JSONValue> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_assessment_assignment_table',
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');
window.scrollTo = jest.fn();

const pageTestingHelper = new PageTestingHelper<assessmentsTableQuery>({
  pageComponent: Assessments,
  compiledQuery: compiledAssessmentsTableQuery,
  defaultQueryResolver: mockQueryPayload,
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/assessments',
    });
    jest.spyOn(moduleApi, 'useFeature').mockImplementation(() => {
      return mockShowTable;
    });
  });

  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/analyst/assessments',
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/analyst?redirect=/analyst/assessments',
      },
    });
  });

  it('should redirect a user logged in with IDIR but not assigned a role', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analyst/assessments',
        claims: {
          client_roles: [],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/analyst/request-access',
      },
    });
  });

  it('should not redirect a user logged in with IDIR and an assigned role', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analyst/assessments',
        claims: {
          client_roles: ['admin'],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({});
  });

  it('should highlight the assessments tab', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByRole('link', { name: 'Assessments' })).toHaveStyle(
      'font-weight: 700;'
    );
  });

  it('should render the table', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Intake')).toBeInTheDocument();
    expect(screen.getByText('CCBC ID')).toBeInTheDocument();
    expect(screen.getByText('Zone')).toBeInTheDocument();
    expect(screen.getByText('PM')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Permitting')).toBeInTheDocument();
    expect(screen.getAllByText('GIS')[1]).toBeInTheDocument();
    expect(screen.getByText('Organization Name')).toBeInTheDocument();
  });
});
