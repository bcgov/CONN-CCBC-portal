import { ObjectFieldTemplateProps } from '@rjsf/utils';
import styled from 'styled-components';

interface FlexProps {
  children?: React.ReactNode;
  direction: string;
  isDividers: any;
  style?: React.CSSProperties;
}

const StyledFlex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  height: 100%;
  flex-wrap: wrap;
  padding-bottom: 32px;

  // Some overrides for widget styles
  & div > div {
    margin: 0px;
  }

  .pg-select-wrapper {
    width: 100%;
    min-width: 284px;
    margin: 8px 0 !important;
  }

  .file-widget {
    min-width: 284px;
    margin-bottom: 8px;
  }

  .datepicker-widget {
    min-width: 284px;
    width: 100%;
  }

  input[inputmode='decimal'] {
    margin-top: 0;
    min-width: 284px;
  }

  ${(props) => props.theme.breakpoint.smallUp} {
    .pg-select-wrapper {
      min-width: 330px;
    }

    .file-widget {
      min-width: 330px;
    }

    .datepicker-widget {
      min-width: 330px;
    }

    input[inputmode='decimal'] {
      min-width: 330px;
    }
  }

  ${(props) => props.theme.breakpoint.mediumUp} {
    padding-right: ${(props) => (props.isDividers ? '16px' : '8px')};
  }

  ${(props) => props.theme.breakpoint.largeUp} {
    padding-right: ${(props) => (props.isDividers ? '16px' : '8px')};
  }

  ${(props) => props.theme.breakpoint.extraLargeUp} {
    .pg-select-wrapper {
      min-width: 212px;
    }

    .datepicker-widget {
      min-width: 212px;
    }

    .file-widget {
      min-width: 340px;
    }

    input[inputmode='decimal'] {
      min-width: 212px;
    }

    padding-bottom: 0px;

    flex-wrap: nowrap;

    // CSS for conditional approval dividers
    & > div:not(:nth-child(1)),
    & > div:not(:nth-last-child(1)) {
      padding-left: ${(props) => (props.isDividers ? '8px' : 'none')};
      border-right: ${(props) =>
        props.isDividers ? '1px solid #d6d6d6;' : 'none'};
    }
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

  h4 {
    color: #9b9b9b;
    margin: 0;
    font-size: 14px;
    margin-bottom: 8px;
    min-height: 15.4px;
  }
`;

const ConditionalApprovalObjectFieldTemplate: React.FC<
  ObjectFieldTemplateProps
> = ({ properties, uiSchema, formContext }) => {
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
      {properties.map((prop) => (
        <div key={prop.content.key}>
          {prop.content}
          {prop.name === 'response' &&
            formContext &&
            formContext?.letterOfApprovalDateSent &&
            !formContext?.isFormEditMode && (
              <div>
                <h4>Date letter sent to applicant</h4>
                <div>{formContext.letterOfApprovalDateSent}</div>
              </div>
            )}
        </div>
      ))}
    </StyledFlex>
  );
};

export default ConditionalApprovalObjectFieldTemplate;
