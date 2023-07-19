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

const BasicFieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  schema,
  uiSchema,
}) => {
  const { title } = schema;
  const uiTitle = uiSchema['ui:title'];
  const fieldTitle = uiTitle || title;

  return (
    <StyledContainer>
      {fieldTitle && <StyledH4>{fieldTitle}</StyledH4>}
      {children}
    </StyledContainer>
  );
};

export default BasicFieldTemplate;
