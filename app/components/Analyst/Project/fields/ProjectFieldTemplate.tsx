import { FieldTemplateProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledH4 = styled.h4`
  color: #9b9b9b;
  margin: 0;
  font-size: 14px;
  margin-bottom: 8px;
`;

const ProjectFieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  uiSchema,
}) => {
  const uiTitle = uiSchema['ui:title'];

  return (
    <div>
      {uiTitle && <StyledH4>{uiTitle}</StyledH4>}
      {children}
    </div>
  );
};

export default ProjectFieldTemplate;
