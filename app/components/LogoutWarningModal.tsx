import React, { useEffect, useState } from 'react';
import Modal from '@button-inc/bcgov-theme/Modal';
import Grid from '@button-inc/bcgov-theme/Grid';
import Button from '@button-inc/bcgov-theme/Button';

interface Props {
  expiresOn: number;
  onExtendSession: () => void;
  logoutPath: string;
  id?: string;
}

export interface WarningModalProps extends Props {
  remainingSeconds: number;
}

const LogoutWarningModal: React.FunctionComponent<
  Props & {
    renderModal?: (props: WarningModalProps) => JSX.Element;
  }
> = (props) => {
  const {
    expiresOn,
    onExtendSession,
    logoutPath,
    renderModal,
    id = 'logout-warning-modal',
  } = props;

  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.floor((expiresOn - Date.now()) / 1000)
  );

  useEffect(() => {
    window.location.hash = id;
    const intervalId = setInterval(() => {
      setRemainingSeconds(
        Math.max(0, Math.floor((expiresOn - Date.now()) / 1000))
      );
    }, 1000);

    return () => {
      window.location.hash = '';
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    console.log('expires on:', expiresOn);
  }, [expiresOn]);

  if (renderModal) {
    return renderModal({ remainingSeconds, ...props });
  }

  // Default render
  return (
    <Modal size="lg" id={id} style={{ zIndex: 100 }}>
      <Modal.Header className="h4">Inactivity Logout Warning</Modal.Header>
      <Modal.Content style={{ padding: '2em' }}>
        <Grid cols={12}>
          <Grid.Row>
            Your session is about to expire due to inactivity.
          </Grid.Row>
          <Grid.Row>
            You will be logged out in {remainingSeconds} seconds.
          </Grid.Row>
          <Grid.Row style={{ marginTop: '1em' }} justify="end">
            <form action={logoutPath} method="post" style={{ marginBottom: 0 }}>
              <Button
                type="submit"
                variant="secondary"
                id="logout-warning-modal-logout-button"
              >
                Logout
              </Button>
            </form>
            <Button
              id="logout-warning-modal-remain-active-button"
              onClick={onExtendSession}
              variant="primary"
              style={{ marginLeft: '1em' }}
            >
              Remain&nbsp;active
            </Button>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default LogoutWarningModal;
