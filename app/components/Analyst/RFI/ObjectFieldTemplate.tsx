import styled from 'styled-components';
import { ObjectFieldTemplateProps } from '@rjsf/utils';
import RequestedFilesField from './RequestedFilesField';

interface ContainerProps {
  columns?: number;
  children?: React.ReactNode;
}

const StyledContainer = styled.div<ContainerProps>`
  column-count: ${(props) => (props.columns ? props.columns : 1)};
  border: none;
  margin-bottom: 16px;
`;

interface StyledItemProps {
  children?: React.ReactNode;
  key?: any;
}

const StyledItem = styled.div<StyledItemProps>`
  & :first-child {
    margin-top: 0;
  }
`;

const StyledH4 = styled.h4`
  width: 100%;
`;

const StyledSection = styled.section`
  display: inline-block;
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
    <StyledSection>
      {showLabel && <StyledH4>{uiSchema['ui:title'] || title}</StyledH4>}

      <StyledContainer columns={columnCount as number}>
        {properties.map((prop: any) => {
          return <StyledItem key={prop.name}>{prop.content}</StyledItem>;
        })}
      </StyledContainer>
    </StyledSection>
  );
};

export default ObjectFieldTemplate;
