// import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';

const StyledDropdown = styled.select`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 0 8px;
  max-width: 100%;
  border-radius: 4px;
`;

const AssignField = ({ fieldValue, fieldName, fieldOptions }) => {
  return (
    <StyledDropdown
      id={`assign-${fieldName}`}
      onChange={(e) => console.log(e.target.value)}
      data-testid={`assign-${fieldName}`}
    >
      {fieldOptions.map((option) => {
        return (
          <option key={option} value={option} selected={fieldValue === option}>
            {option}
          </option>
        );
      })}
    </StyledDropdown>
  );
};

export default AssignField;
