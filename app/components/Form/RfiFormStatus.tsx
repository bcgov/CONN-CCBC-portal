import { graphql, useFragment } from 'react-relay';
import { RfiFormStatus_application$key } from '__generated__/RfiFormStatus_application.graphql';
import GenericFormStatus from './GenericFormStatus';

interface Props {
  application: RfiFormStatus_application$key;
  isSaving: boolean;
  error?: JSX.Element;
}

const RfiFormStatus: React.FC<Props> = ({ application, isSaving, error }) => {
  const {
    rfi: { updatedAt },
    projectName,
    status,
  } = useFragment(
    graphql`
      fragment RfiFormStatus_application on Application {
        rfi {
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
      showProjectDetails={false}
    />
  );
};

export default RfiFormStatus;
