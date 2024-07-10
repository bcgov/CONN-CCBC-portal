import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import InlineTextArea from 'components/InlineTextArea';
import { useUpdateCbcDataByRowIdMutation } from 'schema/mutations/cbc/updateCbcData';

interface Props {
  cbc: any;
  isHeaderEditable: boolean;
}

const CbcEditProjectDescription: React.FC<Props> = ({
  cbc,
  isHeaderEditable,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment CbcEditProjectDescription_query on Cbc {
        cbcDataByCbcId(first: 500) @connection(key: "CbcData__cbcDataByCbcId") {
          __id
          edges {
            node {
              id
              jsonData
              sharepointTimestamp
              rowId
              projectNumber
              updatedAt
              updatedBy
            }
          }
        }
      }
    `,
    cbc
  );
  const { rowId, jsonData } =
    queryFragment?.cbcDataByCbcId?.edges[0].node || {};
  const [description, setDescription] = useState(jsonData?.projectDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [updateStatus] = useUpdateCbcDataByRowIdMutation();

  const handleSubmit = (value: string) => {
    if (value !== description) {
      const newDescription = value;
      const cbcDataId = rowId;
      updateStatus({
        variables: {
          input: {
            rowId: cbcDataId,
            cbcDataPatch: {
              jsonData: {
                ...jsonData,
                projectDescription: newDescription,
              },
            },
          },
        },
        onCompleted: () => {
          setDescription(newDescription);
          setIsEditing(false);
        },
        debounceKey: 'cbc_change_status',
      });
    } else {
      setIsEditing(false);
    }
  };
  return (
    <InlineTextArea
      isEditing={isEditing && isHeaderEditable}
      placeholder="Click to add project description"
      value={description}
      onSubmit={(value) => handleSubmit(value)}
      setIsEditing={setIsEditing}
    />
  );
};

export default CbcEditProjectDescription;
