import styled from 'styled-components';
import { ObjectFieldTemplateProps } from '@rjsf/core';

interface FlexProps {
  direction: string;
}

const StyledFlex = styled.div<FlexProps>`
  display: flex;
  flex-direction: column;
  & input {
    width: margin-right: 16px;
  }

${(props) => props.theme.breakpoint.mediumUp} {
  flex-direction: ${(props) => (props.direction ? props.direction : 'column')};
   gap: 8px;
  .pg-select-wrapper {
    width: 100%;
    min-width: 180px;
  }
}

.datepicker-widget {
   margin-bottom: 16px;
  }
`;

const ProjectObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  uiSchema,
  properties,
}) => {
  const uiOptions = uiSchema['ui:options'];
  const flexDirection = uiOptions?.flexDirection || 'column';
  const before = uiSchema?.['ui:before'];

  return (
    <StyledFlex direction={String(flexDirection)}>
      {before}
      {properties.map((prop) => prop.content)}
    </StyledFlex>
  );
};

export default ProjectObjectFieldTemplate;
