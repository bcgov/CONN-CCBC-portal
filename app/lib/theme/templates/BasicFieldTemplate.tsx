import { FieldTemplateProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledH4 = styled.h4`
  margin: 0;
  font-size: 14px;
  margin-bottom: 8px;
`;

const StyledContainer = styled.div`
  margin-bottom: 16px;
`;

const StyledError = styled.div`
  color: ${({ theme }) => theme.color.error};
  white-space: nowrap;

  &:after {
    content: ' ‎ ';
  }
`;

const BasicFieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  rawErrors,
  schema,
  uiSchema,
}) => {
  const { title } = schema;
  const uiTitle = uiSchema['ui:title'];
  const fieldTitle = uiTitle || title;
  const hideErrors = uiSchema['ui:options']?.hideErrors;

  return (
    <StyledContainer>
      {fieldTitle && <StyledH4>{fieldTitle}</StyledH4>}
      {children}
      {!hideErrors && <StyledError>{rawErrors}</StyledError>}
    </StyledContainer>
  );
};

export default BasicFieldTemplate;
