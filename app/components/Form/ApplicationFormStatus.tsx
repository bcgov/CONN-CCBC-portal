import { graphql, useFragment } from 'react-relay';
import { ApplicationFormStatus_application$key } from '__generated__/ApplicationFormStatus_application.graphql';
import GenericFormStatus from './GenericFormStatus';

interface Props {
  application: ApplicationFormStatus_application$key;
  isSaving: boolean;
  error?: React.ReactElement;
}

const ApplicationFormStatus: React.FC<Props> = ({
  application,
  isSaving,
  error,
}) => {
  const {
    formData: { updatedAt },
    projectName,
    status,
  } = useFragment(
    graphql`
      fragment ApplicationFormStatus_application on Application {
        formData {
          updatedAt
        }
        projectName
        status
      }
    `,
    application
  );

  return (
    <GenericFormStatus
      isSaving={isSaving}
      projectName={projectName}
      status={status}
      updatedAt={updatedAt}
      error={error}
    />
  );
};

export default ApplicationFormStatus;
