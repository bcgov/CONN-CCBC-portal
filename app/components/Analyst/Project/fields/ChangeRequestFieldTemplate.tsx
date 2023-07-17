import { FieldTemplateProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledTextContainer = styled.span`
  text-align: right;
  font-weight: bold;
  max-width: 15ch;
  padding: 10px;
  word-wrap: break-word;
`;

interface ContainerProps {
  flexDirection?: string;
  flexAlign?: string;
}

const StyledContainer = styled.div<ContainerProps>`
  .pg-select-wrapper,
  .datepicker-widget,
  .url-widget-wrapper,
  .ccbcid-widget-wrapper {
    max-width: 300px;
    width: 100%;
  }

  display: flex;
  flex-direction: ${(props) => props.flexDirection ?? 'row'};
  item-align: ${(props) => props.flexAlign ?? 'baseline'}
    ${(props) => props.theme.breakpoint.smallUp} {
    .pg-select-wrapper,
    .datepicker-widget,
    .url-widget-wrapper,
    .ccbcid-widget-wrapper {
      max-width: 340px;
      width: 100%;
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
  const uiTitle = uiSchema['ui:title'];
  const flexDirection = uiSchema['ui:options']?.flexDirection as string;
  const flexAlignment = uiSchema['ui:options']?.flexAlign as string;

  const isFileWidget =
    uiSchema['ui:widget'] === 'FileWidget' ||
    uiSchema['ui:widget'] === 'SowImportFileWidget';

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
