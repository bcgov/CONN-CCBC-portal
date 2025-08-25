import { FieldTemplateProps } from '@rjsf/utils';
import styled from 'styled-components';

const StyledTextContainer = styled.span`
  text-align: left;
  font-weight: bold;
  font-size: 14px;
  min-width: 20ch;
  max-width: 20ch;
  padding: 8px 0;
  word-wrap: break-word;

  ${(props) => props.theme.breakpoint.mediumUp} {
    text-align: right;
    padding: 4px 8px;
  }
`;

interface ContainerProps {
  children?: React.ReactNode;
  flexDirection?: string;
  flexAlign?: string;
}

const StyledContainer = styled.div<ContainerProps>`
  margin-bottom: 16px;
  .pg-select-wrapper,
  .url-widget-wrapper,
  .ccbcid-widget-wrapper {
    max-width: 300px;
    width: 100%;
  }

  .datepicker-widget {
    margin: 0px;
  }

  .radio-widget {
    margin: 4px 0;
  }

  .pg-textarea,
  .pg-textarea-input,
  .textarea-widget {
    max-width: 100%;
    width: 100%;
    margin: 0px;
    margin-bottom: -8px;
  }

  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.flexAlign ?? 'baseline'};

  ${(props) => props.theme.breakpoint.smallUp} {
    margin-bottom: 0px;
    .pg-select-wrapper,
    .url-widget-wrapper,
    .ccbcid-widget-wrapper {
      max-width: 340px;
      width: 100%;
    }
  }

  ${(props) => props.theme.breakpoint.mediumUp} {
    flex-direction: ${(props) => props.flexDirection ?? 'row'};
    .pg-textarea,
    .pg-textarea-input,
    .textarea-widget {
      width: 400px;
    }
  }
  .select-widget-wrapper {
    margin-bottom: 0px;
  }
`;

const ChangeRequestFieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  uiSchema,
}) => {
  const uiTitle = uiSchema['ui:label'] || uiSchema['ui:title'];
  const flexDirection = uiSchema['ui:options']?.flexDirection as string;
  const flexAlignment = uiSchema['ui:options']?.flexAlign as string;

  const isFileWidget =
    uiSchema['ui:widget'] === 'FileWidget' ||
    uiSchema['ui:widget'] === 'ExcelImportFileWidget';

  if (isFileWidget) {
    return (
      <StyledContainer flexAlign={flexAlignment} flexDirection={flexDirection}>
        {uiTitle && <span>{uiTitle}</span>}
        {children}
      </StyledContainer>
    );
  }

  return (
    <StyledContainer flexAlign={flexAlignment} flexDirection={flexDirection}>
      {uiTitle && <StyledTextContainer>{uiTitle}</StyledTextContainer>}
      {children}
    </StyledContainer>
  );
};

export default ChangeRequestFieldTemplate;
