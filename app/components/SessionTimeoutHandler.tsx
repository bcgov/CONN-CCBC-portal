import React, { useEffect, useState } from 'react';
import LogoutWarningModal, { WarningModalProps } from './LogoutWarningModal';
import throttleEventsEffect from './throttleEventsEffect';

// Delay to avoid race condition with the server. On session expiry, we wait
// an additional delay to make sure the session is expired.
const SERVER_DELAY_SECONDS = 2;

interface Props {
  modalDisplaySecondsBeforeLogout?: number;
  sessionRemainingTimePath?: string;
  logoutPath?: string;

  // Callback for when the session has expired
  onSessionExpired?: () => void;

  // Session-expired effect will recheck the session
  // if any of these values change.
  // e.g. with Next.js, use [router] where router = useRouter()
  resetOnChange?: any[];

  renderModal?: (props: WarningModalProps) => JSX.Element;

  // Configuration for automatically extending the session,
  // based on certain user events to listen to.
  // Don't set or set enabled: false to disable.
  extendSessionOnEvents?: {
    enabled: boolean;
    throttleTime?: number;
    events?: string[];
  };
}

const SessionTimeoutHandler: React.FunctionComponent<Props> = ({
  modalDisplaySecondsBeforeLogout = 120,
  sessionRemainingTimePath = '/session-idle-remaining-time',
  logoutPath = '/logout',
  onSessionExpired = () => {},
  resetOnChange = [],
  renderModal,
  extendSessionOnEvents,
}) => {
  const [showModal, setShowModal] = useState(false);

  // UNIX epoch (ms)
  const [sessionExpiresOn, setSessionExpiresOn] = useState(Infinity);

  const extendSession = async () => {
    const response = await fetch(sessionRemainingTimePath);
    if (response.ok) {
      const timeout = Number(await response.json());
      if (timeout > modalDisplaySecondsBeforeLogout) {
        setShowModal(false);
      }
      setSessionExpiresOn(Date.now());
    }
  };

  // default values will be used for throttleTime
  // and events if they are undefined.
  if (extendSessionOnEvents && extendSessionOnEvents.enabled)
    useEffect(
      throttleEventsEffect(
        extendSession,
        extendSessionOnEvents.throttleTime,
        extendSessionOnEvents.events
      ),
      []
    );

  useEffect(() => {
    console.log(new Date(sessionExpiresOn));
  }, [resetOnChange, sessionExpiresOn]);

  useEffect(() => {
    let modalDisplayTimeoutId: any;
    let sessionTimeoutId: any;

    const checkSessionIdle = async () => {
      setShowModal(true);

      const response = await fetch(sessionRemainingTimePath);
      if (response.ok) {
        const secondsRemainingInSession = Number(await response.json());
        console.log('secondsRemainingInSession', secondsRemainingInSession);
        setSessionExpiresOn(Date.now() + secondsRemainingInSession * 1000);
        setShowModal(true);

        if (secondsRemainingInSession > 0) {
          if (secondsRemainingInSession > modalDisplaySecondsBeforeLogout) {
            setShowModal(false);
            modalDisplayTimeoutId = setTimeout(() => {
              setShowModal(true);
            }, (secondsRemainingInSession - modalDisplaySecondsBeforeLogout) * 1000);
          } else {
            setShowModal(true);
          }

          // If the user has not extended their session by then we will redirect them (by invoking onSessionExpired() below)
          // If they do extend their session (or have in a different tab), the `checkSessionIdle()` call will branch into the first condition above, hide the modal,
          // and set another timeout to check the session idle when the modal is due to be displayed.
          sessionTimeoutId = setTimeout(() => {
            checkSessionIdle();
          }, (secondsRemainingInSession + SERVER_DELAY_SECONDS) * 1000);
        } else {
          onSessionExpired();
        }
      } else onSessionExpired();
    };

    checkSessionIdle();

    // Return cleanup function
    return () => {
      clearTimeout(modalDisplayTimeoutId);
      clearTimeout(sessionTimeoutId);
    };
  }, [...resetOnChange]);

  return (
    <>
      {showModal && (
        <LogoutWarningModal
          expiresOn={sessionExpiresOn}
          onExtendSession={extendSession}
          logoutPath={logoutPath}
          renderModal={renderModal}
        />
      )}
    </>
  );
};

export default SessionTimeoutHandler;
