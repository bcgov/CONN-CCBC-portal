import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { useUpdateApplicationMutation } from 'schema/mutations/application/updateApplication';
import InlineTextArea from 'components/InlineTextArea';

interface Props {
  application: any;
}

const EditProjectDescription: React.FC<Props> = ({ application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment EditProjectDescription_query on Application {
        id
        rowId
        internalDescription
      }
    `,
    application
  );
  const { internalDescription, rowId } = queryFragment;

  const [isEditing, setIsEditing] = useState(false);
  const [updateApplication] = useUpdateApplicationMutation();

  const handleSubmit = (value: string) => {
    if (value !== internalDescription) {
      updateApplication({
        variables: {
          input: { applicationPatch: { internalDescription: value }, rowId },
        },
        onCompleted: () => {
          setIsEditing(false);
        },
      });
    } else {
      setIsEditing(false);
    }
  };
  return (
    <InlineTextArea
      isEditing={isEditing}
      placeholder="Click to add internal project description"
      value={internalDescription}
      onSubmit={(value) => handleSubmit(value)}
      setIsEditing={setIsEditing}
    />
  );
};

export default EditProjectDescription;
