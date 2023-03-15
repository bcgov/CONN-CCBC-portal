import { ObjectFieldTemplateProps } from '@rjsf/core';
import styled from 'styled-components';

interface FlexProps {
  direction: string;
  isDividers: any;
}

const StyledFlex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  height: 100%;
  flex-wrap: wrap;
  padding-bottom: 32px;

  ${(props) => props.theme.breakpoint.largeUp} {
    padding-bottom: 0px;
    padding-right: ${(props) => (props.isDividers ? '16px' : '8px')};

    // CSS for conditional approval dividers
    // May want to move these to a conditional approval specific object field template in the future
    & > div:not(:nth-child(1)),
    & > div:not(:nth-last-child(1)) {
      padding-left: ${(props) => (props.isDividers ? '8px' : 'none')};
      border-right: ${(props) =>
        props.isDividers ? '1px solid #d6d6d6;' : 'none'};
    }
  }

  ${(props) => props.theme.breakpoint.largeUp} {
    flex-wrap: nowrap;
  }

  // CSS for conditional approval dividers
  & > div:not(:nth-child(1)),
  & > div:not(:nth-last-child(1)) {
    padding-left: ${(props) => (props.isDividers ? '8px' : 'none')};
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
  const before = uiSchema?.['ui:before'];

  return (
    <StyledFlex
      style={{
        marginRight: isDividers ? '16px' : '0px',
      }}
      direction={String(flexDirection)}
      isDividers={isDividers}
    >
      {before}
      {properties.map((prop) => prop.content)}
    </StyledFlex>
  );
};

export default TrackingObjectFieldTemplate;
