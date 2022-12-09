import styled from 'styled-components';
import { ObjectFieldTemplateProps } from '@rjsf/core';
import RequestedFilesField from './RequestedFilesField';

interface ContainerProps {
  columns?: number;
}

const StyledContainer = styled.div<ContainerProps>`
  column-count: ${(props) => (props.columns ? props.columns : 1)};
  border: none;
  margin-bottom: 16px;
`;

const StyledItem = styled.div`
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
  const options = uiSchema['ui:options'];
  const columnCount = options?.columns ? options?.columns : 1;
  const showLabel = options?.label !== false;
  const reqFilesField = uiSchema?.['ui:field'] === 'RequestedFilesField';

  if (reqFilesField) {
    return <RequestedFilesField properties={properties} />;
  }
  return (
    <section>
      {showLabel && <StyledH4>{uiSchema['ui:title'] || title}</StyledH4>}

      <StyledContainer columns={columnCount as number}>
        {properties.map((prop: any) => {
          return <StyledItem key={prop.name}>{prop.content}</StyledItem>;
        })}
      </StyledContainer>
    </section>
  );
};

export default ObjectFieldTemplate;
