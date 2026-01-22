import { Profiler, useEffect } from 'react';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import { useFeature } from '@growthbook/growthbook-react';
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
  /* ---- BEGIN DEBUG ---- */
  if (typeof window !== 'undefined') {
    const { origin } = window.location;
    const env =
      process?.env?.NODE_ENV ||
      (process?.env?.NEXT_PUBLIC_ENV as string) ||
      'unknown';
    // Log once per page load for cross-env comparisons
    if (!(window as any).__ccbcDashboardLogBoot) {
      (window as any).__ccbcDashboardLogBoot = true;
      console.log('[AnalystDashboard] boot', {
        origin,
        env,
        time: new Date().toISOString(),
      });
    }
  }
  /* ---- END DEGUG ---- */
  const query = usePreloadedQuery(getDashboardAnalystQuery, preloadedQuery);
  const router = useRouter();
  const { session } = query;
  const isMaxWidthOverride = useFeature('max_width_override').value;
  cookie.set('role', session.authRole);
  const scrollHandler = () => {
    sessionStorage.setItem('dashboard_scroll_position', String(window.scrollY));
  };

  useEffect(() => {
    /* ---- BEGIN DEBUG ---- */
    console.log('[AnalystDashboard] effect:init', {
      authRole: session?.authRole,
      isMaxWidthOverride,
    });
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
          console.log('[AnalystDashboard] router.replace done', {
            orderByParam,
            scrollPosition,
          });
        });
    } else if (scrollPosition) {
      scrollTo();
    }

    window.addEventListener('scroll', scrollHandler);
    console.log('[AnalystDashboard] scroll listener attached');

    // remove assessment_last_visited cookie
    cookie.remove('assessment_last_visited');

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      console.log('[AnalystDashboard] scroll listener removed');
      /* ---- END DEGUG ---- */
    };

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
            /* ---- BEGIN DEBUG ---- */
            if (phase === 'update') {
              console.log(`AnalystDashboard render time: ${actualDuration}ms`);
            }
            console.log('[AnalystDashboard] profiler', {
              id,
              phase,
              actualDuration,
              now: performance.now(),
            });
            /* ---- END DEGUG ---- */
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
