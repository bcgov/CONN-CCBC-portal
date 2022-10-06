import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import { DateTime } from 'luxon';
import { ApplicationFormStatus_application$key } from '__generated__/ApplicationFormStatus_application.graphql';
import LoadingSpinner from 'components/LoadingSpinner';

const AppName = styled('div')`
  max-width: 280px;
  white-space: nowrap;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 1rem;
`;

const AppStatus = styled('div')`
  text-transform: capitalize;
  font-style: italic;
`;

const StatusNameFlex = styled('div')`
  display: flex;
`;

const StatusContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const SavingStatusContainer = styled('div')`
  display: flex;
  height: 24px;
  align-items: center;
`;

const ErrorContainer = styled('div')`
  height: 48px;
  color: #d8292f;
  text-align: right;
`;

interface Props {
  application: ApplicationFormStatus_application$key;
  isSaving: boolean;
  error?: JSX.Element;
}

const ApplicationFormStatus: React.FC<Props> = ({
  application,
  isSaving,
  error,
}) => {
  const { updatedAt, formData, status } = useFragment(
    graphql`
      fragment ApplicationFormStatus_application on Application {
        updatedAt
        formData {
          formData
        }
        status
      }
    `,
    application
  );
  let savingStatusIndicator = (
    <>
      Saving&nbsp;
      <LoadingSpinner color="#3F5986" />
    </>
  );

  if (!isSaving) {
    const updatedAtDateTime = DateTime.fromISO(updatedAt, { locale: 'en-CA' });
    const wasUpdatedToday =
      DateTime.now()
        .startOf('day')
        .diff(updatedAtDateTime.startOf('day'), 'days').days === 0;
    const lastSaved = updatedAtDateTime.toLocaleString(
      wasUpdatedToday
        ? DateTime.TIME_24_SIMPLE
        : { month: 'short', day: 'numeric' }
    );
    savingStatusIndicator = <>Last saved: {lastSaved}</>;
  }

  return (
    <StatusContainer>
      <StatusNameFlex>
        <AppStatus>{status}</AppStatus>
        <AppName>{formData.formData?.projectInformation?.projectTitle}</AppName>
      </StatusNameFlex>
      <SavingStatusContainer aria-live="off" aria-label="form saving status">
        {savingStatusIndicator}
      </SavingStatusContainer>
      <ErrorContainer>{error}</ErrorContainer>
    </StatusContainer>
  );
};

export default ApplicationFormStatus;
