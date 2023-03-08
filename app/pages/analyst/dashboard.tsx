import { useEffect } from 'react';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import cookie from 'js-cookie';
import { DashboardTabs, AnalystRow } from 'components/AnalystDashboard';
import { TextFilter, NumberFilter } from 'components/Table/Filters';
import Table from 'components/Table';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { dashboardAnalystQuery } from '__generated__/dashboardAnalystQuery.graphql';
import { useRouter } from 'next/router';

const DEFAULT_SORT = 'CCBC_NUMBER_ASC';

const tableFilters = [
  new NumberFilter('Intake', 'intakeNumber'),
  new TextFilter('CCBC ID', 'ccbcNumber'),
  new TextFilter('Status', 'statusSortFilter'),
  new TextFilter('Project title', 'projectName'),
  new TextFilter('Organization', 'organizationName'),
  new TextFilter('Lead', 'analystLead'),
  new NumberFilter('Package', 'package'),
];
// will probably have to change to cursor for pagination/infinte scroll
const getDashboardAnalystQuery = graphql`
  query dashboardAnalystQuery(
    $offset: Int
    # commenting out since we do not want the pagesize to be taken from the query
    # $pageSize: Int
    $orderBy: [ApplicationsOrderBy!]
    $intakeNumber: Int
    $ccbcNumber: String
    $projectName: String
    $organizationName: String
    $analystLead: String
    $package: Int
    $statusSortFilter: String
  ) {
    session {
      sub
      ...DashboardTabs_query
    }
    ...AnalystRow_query
    allApplications(
      first: 500
      offset: $offset
      orderBy: $orderBy
      filter: {
        intakeNumber: { equalTo: $intakeNumber }
        ccbcNumber: { includesInsensitive: $ccbcNumber }
        status: { includesInsensitive: $statusSortFilter }
        projectName: { includesInsensitive: $projectName }
        organizationName: { includesInsensitive: $organizationName }
        analystLead: { includesInsensitive: $analystLead }
        package: { equalTo: $package }
      }
    ) {
      totalCount
      edges {
        node {
          id
          rowId
          ...AnalystRow_application
        }
      }
    }
  }
`;

const StyledDashboardContainer = styled.div`
  width: 100%;
`;

const StyledSortText = styled.button`
  color: #3f5986;
  margin-bottom: 24px;
  cursor: pointer;
`;

const AnalystDashboard = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, dashboardAnalystQuery>) => {
  const query = usePreloadedQuery(getDashboardAnalystQuery, preloadedQuery);
  const router = useRouter();
  const { session, allApplications } = query;

  const hasSort = router.query?.orderBy;

  const handleClearSorting = () => {
    const url = {
      pathname: router.pathname,
      query: {
        ...router.query,
        orderBy: null,
      },
    };
    cookie.remove('analyst.sort');
    router.replace(url, url, { shallow: true });
  };

  const scrollHandler = () => {
    sessionStorage.setItem('dashboard_scroll_position', String(window.scrollY));
  };

  useEffect(() => {
    // Scroll to saved scroll position
    const scrollPosition = sessionStorage.getItem('dashboard_scroll_position');
    if (scrollPosition) {
      window.scrollTo({
        top: Number(scrollPosition),
        behavior: 'smooth',
      });
    }
    window.addEventListener('scroll', scrollHandler);

    // Set saved sort order
    const orderByParam = cookie.get('analyst.sort');
    if (orderByParam)
      router.replace({
        query: { ...router.query, orderBy: orderByParam },
      });

    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledDashboardContainer>
        <DashboardTabs session={session} />
        {hasSort && (
          <StyledSortText onClick={handleClearSorting}>
            Clear sorting
          </StyledSortText>
        )}
        <Table
          pageQuery={getDashboardAnalystQuery}
          paginated={false}
          filters={tableFilters}
          totalRowCount={allApplications.totalCount}
        >
          {allApplications.edges.map(({ node }) => (
            <AnalystRow key={node.id} query={query} application={node} />
          ))}
        </Table>
      </StyledDashboardContainer>
    </Layout>
  );
};

export default withRelay(AnalystDashboard, getDashboardAnalystQuery, {
  ...defaultRelayOptions,
  variablesFromContext: (ctx) => {
    const variables = defaultRelayOptions.variablesFromContext(ctx);
    const orderBy = variables?.orderBy || DEFAULT_SORT;
    return {
      ...variables,
      orderBy,
    };
  },
});
