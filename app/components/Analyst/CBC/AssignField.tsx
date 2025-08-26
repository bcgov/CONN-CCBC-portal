import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { useUpdateCbcDataByRowIdMutation } from 'schema/mutations/cbc/updateCbcData';
import styled from 'styled-components';

interface StyledDropdownProps {
  children?: React.ReactNode;
  id?: string;
  onChange?: (e: any) => void;
  'data-testid'?: string;
}

const StyledDropdown = styled.select<StyledDropdownProps>`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 0 8px;
  max-width: 100%;
  border-radius: 4px;
`;

const AssignField = ({
  fieldName,
  fieldOptions,
  fieldType,
  cbc,
  isFormEditable,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment AssignField_query on Cbc {
        cbcDataByCbcId(first: 500) @connection(key: "CbcData__cbcDataByCbcId") {
          edges {
            node {
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
  const { jsonData } = queryFragment.cbcDataByCbcId.edges[0].node;

  const [updateField] = useUpdateCbcDataByRowIdMutation();
  const [fieldValue, setFieldValue] = useState(
    fieldType === 'string'
      ? jsonData[fieldName].toString() || null
      : jsonData[fieldName] || null
  );

  const handleChange = (e) => {
    const { rowId } = queryFragment.cbcDataByCbcId.edges[0].node;
    updateField({
      variables: {
        input: {
          rowId,
          cbcDataPatch: {
            jsonData: {
              ...jsonData,
              [fieldName]:
                fieldType === 'number'
                  ? parseInt(e.target.value, 10)
                  : e.target.value,
            },
          },
        },
      },
      onCompleted: () => {
        setFieldValue(e.target.value);
      },
      debounceKey: 'cbc_assign_field',
    });
  };

  return (
    <StyledDropdown
      id={`assign-${fieldName}`}
      onChange={(e) => handleChange(e)}
      data-testid={`assign-${fieldName}`}
    >
      {fieldOptions.map((option) => {
        return (
          <option
            key={option}
            value={option}
            selected={fieldValue === option}
            disabled={!isFormEditable}
          >
            {option}
          </option>
        );
      })}
    </StyledDropdown>
  );
};

export default AssignField;
