import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { useCreateApplicationInternalDescriptionMutation } from 'schema/mutations/application/createApplicationInternalDescription';
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
  const [createDescription] = useCreateApplicationInternalDescriptionMutation();

  const handleSubmit = (value: string) => {
    if (value !== internalDescription) {
      createDescription({
        variables: {
          input: { _applicationId: rowId, _description: value },
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
