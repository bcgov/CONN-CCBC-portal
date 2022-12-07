import styled from 'styled-components';
import { ObjectFieldTemplateProps } from '@rjsf/core';

interface ContainerProps {
  columns?: number;
}

const StyledFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: none;
`;

const StyledItem = styled.div<ContainerProps>`
  flex: 1;
  flex-basis: ${(props) => (props.columns === 2 ? '50%' : '100%')};

  & :first-child {
    margin-top: 0;
  }
`;

const StyledH4 = styled.h4`
  width: 100%;
`;

const ObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  uiSchema,
  title,
  properties,
}) => {
  const columnCount = uiSchema['ui:options']?.columns
    ? uiSchema['ui:options']?.columns
    : 1;

  const showLabel = uiSchema['ui:options']?.label !== false;

  return (
    <section>
      {showLabel && <StyledH4>{uiSchema['ui:title'] || title}</StyledH4>}

      <StyledFlex className="formFieldset">
        {properties.map((prop: any) => {
          return (
            <StyledItem key={prop.name} columns={columnCount as number}>
              {prop.content}
            </StyledItem>
          );
        })}
      </StyledFlex>
    </section>
  );
};

export default ObjectFieldTemplate;
