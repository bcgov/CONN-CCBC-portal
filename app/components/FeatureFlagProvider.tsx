import React, { createContext, useContext, useEffect, useState } from 'react';
import { graphql, fetchQuery, useRelayEnvironment } from 'react-relay';
import reportClientError from 'lib/helpers/reportClientError';
import type { FeatureFlagProviderQuery } from '__generated__/FeatureFlagProviderQuery.graphql';

const featureFlagsQuery = graphql`
  query FeatureFlagProviderQuery {
    allFeatureFlags(first: 999, condition: { archivedAt: null }) {
      edges {
        node {
          flagKey
          isEnabled
          value
        }
      }
    }
  }
`;

export type FeatureFlagEntry = { isEnabled: boolean; value: unknown };
export type FeatureFlagMap = Record<string, FeatureFlagEntry>;

const FeatureFlagContext = createContext<FeatureFlagMap>({});

export const useFeatureFlagMap = () => useContext(FeatureFlagContext);

const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [flags, setFlags] = useState<FeatureFlagMap>({});
  const environment = useRelayEnvironment();

  useEffect(() => {
    const loadFeatureFlags = async () => {
      try {
        const { allFeatureFlags } = await fetchQuery<FeatureFlagProviderQuery>(
          environment,
          featureFlagsQuery,
          {}
        ).toPromise();

        const flagMap = (allFeatureFlags?.edges ?? []).reduce(
          (map, edge) => ({
            ...map,
            [edge.node.flagKey]: {
              isEnabled: edge.node.isEnabled,
              value: edge.node.value,
            },
          }),
          {} as FeatureFlagMap
        );
        setFlags(flagMap);
      } catch (err) {
        reportClientError(err, { source: 'feature-flags-refresh' });
      }
    };
    loadFeatureFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export default FeatureFlagProvider;
