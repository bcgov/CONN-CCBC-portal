import { FieldProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledColLeft = styled('td')`
  // Todo: workaround for Jest styled component theme prop error
  // background-color: ${(props) => props.theme.color.backgroundGrey};
  background-color: '#F2F2F2';
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-left: 0;
  font-weight: 400;
  white-space: pre-line;
  vertical-align: top;
`;

const StyledColRight = styled('td')`
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-right: 0;
  font-weight: 400;
  white-space: pre-line;
`;

const StyledColError = styled(StyledColRight)`
  background-color: rgba(248, 214, 203, 0.4);
  // background-color: ${(props) => props.theme.color.errorBackground};
`;

const ReviewStringField: React.FC<FieldProps> = ({
  id,
  formData,
  rawErrors,
  schema,
}) => {
  return (
    <tr>
      <StyledColLeft id={id}>{schema.title}</StyledColLeft>
      {rawErrors && rawErrors.length > 0 ? (
        <StyledColError id={`${id}-error`} />
      ) : (
        <StyledColRight id={`${id}-value`}>{formData}</StyledColRight>
      )}
    </tr>
  );
};

export default ReviewStringField;
