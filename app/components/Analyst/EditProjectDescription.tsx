import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { useCreateNewFormDataMutation } from 'schema/mutations/application/createNewFormData';
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
        formData {
          id
          formSchemaId
          jsonData
        }
      }
    `,
    application
  );
  const {
    formData: { formSchemaId, jsonData },
    id,
    rowId,
  } = queryFragment;
  const projectDescription = jsonData?.projectInformation?.projectDescription;

  const [isEditing, setIsEditing] = useState(false);
  const [createNewFormData] = useCreateNewFormDataMutation();

  const handleSubmit = (value: string) => {
    if (value !== projectDescription) {
      const newJsonData = {
        ...jsonData,
        projectInformation: {
          ...jsonData.projectInformation,
          projectDescription: value,
        },
      };

      createNewFormData({
        variables: {
          input: {
            applicationRowId: rowId,
            jsonData: newJsonData,
            reasonForChange: 'Update project description',
            formSchemaId,
          },
        },
        onCompleted: () => {
          setIsEditing(false);
        },
        updater: (store, data) => {
          store
            .get(id)
            .setLinkedRecord(
              store.get(data.createNewFormData.formData.id),
              'formData'
            );
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
      value={projectDescription}
      onSubmit={(value) => handleSubmit(value)}
      setIsEditing={setIsEditing}
    />
  );
};

export default EditProjectDescription;
