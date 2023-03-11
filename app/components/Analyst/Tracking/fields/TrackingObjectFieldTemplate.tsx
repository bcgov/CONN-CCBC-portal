import { ObjectFieldTemplateProps } from '@rjsf/core';
import styled from 'styled-components';

interface FlexProps {
  direction: string;
  maxWidth: string;
  isDivider: any;
}

const StyledFlex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : '100%')};
  padding-right: ${(props) => (props.isDivider ? '16px' : '8px')};
  border-right: ${(props) => (props.isDivider ? '1px solid #d6d6d6;' : 'none')};
  height: 100%;
`;

const StyledH4 = styled.h4`
  color: #9b9b9b;
  margin: 0;
  font-size: 14px;
  margin-bottom: 8px;
`;

const TrackingObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  properties,
  uiSchema,
}) => {
  const uiTitle = uiSchema['ui:title'];
  const uiOptions = uiSchema['ui:options'];
  const flexDirection = uiOptions?.flexDirection;
  const isDivider = uiOptions?.divider;
  const maxWidth = uiOptions?.maxWidth;
  const before = uiSchema?.['ui:before'];

  return (
    <StyledFlex
      style={{ marginRight: isDivider ? '16px' : '0px' }}
      direction={String(flexDirection)}
      isDivider={isDivider}
      maxWidth={String(maxWidth)}
    >
      <StyledH4>{uiTitle}</StyledH4>
      {before}
      {properties.map((prop) => prop.content)}
    </StyledFlex>
  );
};

export default TrackingObjectFieldTemplate;
