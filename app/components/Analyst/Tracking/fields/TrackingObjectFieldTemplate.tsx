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
  height: 100%;

  & > div:not(:last-of-type),
  & > div:not(:first-of-type) {
    padding-left: 16px;
    border-right: ${(props) =>
      props.isDivider ? '1px solid #d6d6d6;' : 'none'};
  }

  & > div:nth-child(1),
  & > div:nth-last-child(1) {
    border: none;
  }

  // Set margin top for custom field titles
  & div > div > div:not(:first-child) {
    h4 {
      margin-top: 8px;
    }
  }
`;

const TrackingObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  properties,
  uiSchema,
}) => {
  const uiOptions = uiSchema['ui:options'];
  const flexDirection = uiOptions?.flexDirection;
  const isDividers = uiOptions?.dividers;
  const maxWidth = uiOptions?.maxWidth;
  const before = uiSchema?.['ui:before'];
  return (
    <StyledFlex
      style={{
        marginRight: isDividers ? '16px' : '0px',
      }}
      direction={String(flexDirection)}
      isDivider={isDividers}
      maxWidth={String(maxWidth)}
    >
      {before}
      {properties.map((prop) => prop.content)}
    </StyledFlex>
  );
};

export default TrackingObjectFieldTemplate;
