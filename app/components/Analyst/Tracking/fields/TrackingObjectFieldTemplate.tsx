import { ObjectFieldTemplateProps } from '@rjsf/core';
import styled from 'styled-components';

interface FlexProps {
  direction: string;
  isDividers: any;
}

const StyledFlex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  padding-right: ${(props) => (props.isDividers ? '16px' : '8px')};
  height: 100%;

  // CSS for conditional approval dividers.
  // May want to move these out of the general tracking template for future sections.
  & > div:not(:nth-child(1)),
  & > div:not(:nth-last-child(1)) {
    padding-left: ${(props) => (props.isDividers ? '8px' : 'none')};
    border-right: ${(props) =>
      props.isDividers ? '1px solid #d6d6d6;' : 'none'};
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
      isDividers={isDividers}
      maxWidth={String(maxWidth)}
    >
      {before}
      {properties.map((prop) => prop.content)}
    </StyledFlex>
  );
};

export default TrackingObjectFieldTemplate;
