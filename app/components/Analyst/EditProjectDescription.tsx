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
        rowId
        formData {
          formSchemaId
          jsonData
        }
      }
    `,
    application
  );
  const {
    formData: { formSchemaId, jsonData },
    rowId,
  } = queryFragment;
  const projectDescription = jsonData?.projectInformation?.projectDescription;

  const [createNewFormData] = useCreateNewFormDataMutation();

  const handleSubmit = (value: string) => {
    if (value) {
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
      });
    }
  };
  return (
    <InlineTextArea
      value={projectDescription}
      onSubmit={(value) => handleSubmit(value)}
    />
  );
};

export default EditProjectDescription;
