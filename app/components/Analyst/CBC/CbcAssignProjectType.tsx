import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { useUpdateCbcDataByRowIdMutation } from 'schema/mutations/cbc/updateCbcData';
import styled from 'styled-components';

interface Props {
  cbc: any;
  isHeaderEditable: boolean;
}

const StyledDropdown = styled.select`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 0 8px;
  max-width: 100%;
  border-radius: 4px;
`;

const CbcAssignProjectType: React.FC<Props> = ({ cbc, isHeaderEditable }) => {
  const queryFragment = useFragment(
    graphql`
      fragment CbcAssignProjectType_query on Cbc {
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
  const [projectType, setProjectType] = useState(jsonData?.projectType);
  const [updateStatus] = useUpdateCbcDataByRowIdMutation();

  const handleAssignProjectType = (e: any) => {
    const newProjectType = e.target.value || null;
    const cbcDataId = rowId;
    updateStatus({
      variables: {
        input: {
          rowId: cbcDataId,
          cbcDataPatch: {
            jsonData: {
              ...jsonData,
              projectType: newProjectType,
            },
          },
        },
      },
      onCompleted: () => {
        setProjectType(newProjectType);
      },
      debounceKey: 'cbc_change_status',
    });
  };
  const options = [
    'Transport',
    'Plan',
    'Last-Mile',
    'Last-Mile & Transport',
    'Last-Mile & Cellular',
    'Cellular',
  ];
  return (
    <StyledDropdown
      id="assign-project-type"
      onChange={handleAssignProjectType}
      data-testid="assign-cbc-project_type"
    >
      {options.map((option) => {
        return (
          <option
            key={option}
            value={option}
            selected={projectType === option}
            disabled={!isHeaderEditable}
          >
            {option}
          </option>
        );
      })}
    </StyledDropdown>
  );
};

export default CbcAssignProjectType;
