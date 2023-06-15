import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import config from 'config';
import { graphql, fetchQuery, useRelayEnvironment } from 'react-relay';
import { SessionTimeoutHandler } from './ssoReact';
import type { SessionExpiryHandlerQuery } from '../__generated__/SessionExpiryHandlerQuery.graphql';

const sessionQuery = graphql`
  query SessionExpiryHandlerQuery {
    session {
      __typename
    }
  }
`;

const SessionExpiryHandler: React.FC = () => {
  const [hasSession, setHasSession] = useState(false);

  const router = useRouter();
  const environment = useRelayEnvironment();

  useEffect(() => {
    const checkSessionAndGroups = async () => {
      const { session } = await fetchQuery<SessionExpiryHandlerQuery>(
        environment,
        sessionQuery,
        {}
      ).toPromise();
      setHasSession(!!session);
    };
    checkSessionAndGroups();
    // This effect only needs to be run once on mount, even if the relay environment changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLogOutUrl = () => {
    const logoutUrl = config.get('SITEMINDER_LOGOUT_URL');
    const localRedirectURL = `${window.location.origin}/${router.asPath}`;
    return `${logoutUrl}?returl=${localRedirectURL}&retnow=1`;
  };

  const handleSessionExpired = () => {
    setHasSession(false);
    const logOutURL = getLogOutUrl();

    if (!logOutURL) {
      router.push({
        pathname: '/',
        query: {
          redirectTo: router.asPath,
          sessionIdled: true,
        },
      });
    }

    window.location.replace(logOutURL);
  };

  if (hasSession)
    if (hasSession)
      return (
        <SessionTimeoutHandler
          modalDisplaySecondsBeforeLogout={120}
          onSessionExpired={handleSessionExpired}
          resetOnChange={[router]}
          extendSessionOnEvents={{
            enabled: true,
            throttleTime: 200000,
            events: ['keydown', 'mousedown', 'scroll'],
          }}
        />
      );

  return null;
};

export default SessionExpiryHandler;
