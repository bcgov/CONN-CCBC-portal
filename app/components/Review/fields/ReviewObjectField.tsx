import { FieldProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledTitleRow = styled('td')`
  padding: 16px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.16);
`;

const StyledH4 = styled('h4')`
  margin: 0;
`;

const ReviewObjectField: React.FC<FieldProps> = ({ schema }) => {
  return (
    <tr>
      <StyledTitleRow colSpan={2}>
        <StyledH4>{schema.title}</StyledH4>
      </StyledTitleRow>
    </tr>
  );
};

export default ReviewObjectField;
