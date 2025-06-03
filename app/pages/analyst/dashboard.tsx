import { Profiler, useEffect } from 'react';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { useFeature } from '@growthbook/growthbook-react';
import { graphql } from 'react-relay';
import cookie from 'js-cookie';
import { DashboardTabs, TableTabs } from 'components/AnalystDashboard';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { dashboardAnalystQuery } from '__generated__/dashboardAnalystQuery.graphql';
import { useRouter } from 'next/router';
import AllDashboardTable from 'components/AnalystDashboard/AllDashboard';

// will probably have to change to cursor for pagination/infinte scroll
const getDashboardAnalystQuery = graphql`
  query dashboardAnalystQuery {
    session {
      sub
      authRole
      ...DashboardTabs_query
    }
    totalAvailableApplications: allApplications {
      totalCount
    }
    ...AllDashboardTable_query
  }
`;

const StyledDashboardContainer = styled.div`
  width: 100%;
`;

const AnalystDashboard = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, dashboardAnalystQuery>) => {
  const query = usePreloadedQuery(getDashboardAnalystQuery, preloadedQuery);
  const router = useRouter();
  const { session } = query;
  const isMaxWidthOverride = useFeature('max_width_override').value;
  cookie.set('role', session.authRole);
  const scrollHandler = () => {
    sessionStorage.setItem('dashboard_scroll_position', String(window.scrollY));
  };

  useEffect(() => {
    // Scroll to saved scroll position
    const scrollPosition = sessionStorage.getItem('dashboard_scroll_position');

    const scrollTo = () => {
      window.scrollTo({
        top: Number(scrollPosition),
        behavior: 'auto',
      });
    };

    // Set saved sort order
    const orderByParam = cookie.get('analyst.sort');
    if (orderByParam) {
      router
        .replace({
          query: { ...router.query, orderBy: orderByParam },
        })
        .then(() => {
          if (scrollPosition) scrollTo();
        });
    } else if (scrollPosition) {
      scrollTo();
    }

    window.addEventListener('scroll', scrollHandler);

    // remove assessment_last_visited cookie
    cookie.remove('assessment_last_visited');

    return () => window.removeEventListener('scroll', scrollHandler);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      session={session}
      title="Connecting Communities BC"
      maxWidthOverride={isMaxWidthOverride && '1600px'}
    >
      <StyledDashboardContainer>
        <DashboardTabs session={session} />
        <TableTabs />
        <Profiler
          id="AnalystDashboard"
          onRender={(id, phase, actualDuration) => {
            if (phase === 'update') {
              console.log(`AnalystDashboard render time: ${actualDuration}ms`);
            }
          }}
        >
          <AllDashboardTable query={query} />
        </Profiler>
      </StyledDashboardContainer>
    </Layout>
  );
};

export default withRelay(AnalystDashboard, getDashboardAnalystQuery, {
  ...defaultRelayOptions,
  variablesFromContext: (ctx) => {
    const variables = defaultRelayOptions.variablesFromContext(ctx);
    return {
      ...variables,
    };
  },
});
