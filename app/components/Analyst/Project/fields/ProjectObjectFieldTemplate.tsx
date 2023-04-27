import styled from 'styled-components';
import { ObjectFieldTemplateProps } from '@rjsf/core';

interface FlexProps {
  direction: string;
}

const StyledFlex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => (props.direction ? props.direction : 'column')};
`;

const ProjectObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  uiSchema,
  properties,
}) => {
  const uiOptions = uiSchema['ui:options'];
  const flexDirection = uiOptions?.flexDirection || 'column';
  const before = uiSchema?.['ui:before'];
  console.log(flexDirection);
  return (
    <StyledFlex direction={String(flexDirection)}>
      {before}
      {properties.map((prop) => prop.content)}
    </StyledFlex>
  );
};

export default ProjectObjectFieldTemplate;
