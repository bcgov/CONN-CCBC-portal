import React from 'react';
import { Help } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { FieldTemplateProps } from '@rjsf/utils';
import styled from 'styled-components';

const StyledH4 = styled.h4`
  color: #9b9b9b;
  margin: 0;
  font-size: 14px;
  margin-bottom: 8px;
`;

const StyledContainer = styled.div`
  .pg-select-wrapper,
  .datepicker-widget,
  .url-widget-wrapper,
  .ccbcid-widget-wrapper {
    max-width: 100%;
    width: 100%;
  }

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

interface StyledInputWrapperProps {
  errorColor?: string;
  hasError?: boolean;
  children?: React.ReactNode;
}

const StyledInputWrapper = styled.div<StyledInputWrapperProps>`
  ${(props) =>
    props.hasError &&
    `
      position: relative;
      background-color: ${props.errorColor};
      padding: 8px;
      margin-bottom: 8px;
      max-width: calc(100% - 8px) !important;

      .pg-select-wrapper,
      .datepicker-widget,
      .url-widget-wrapper,
      .ccbcid-widget-wrapper {
        background-color: white !important;
        max-width: calc(340px - 8px) !important;
      }

      [class*='StyledMessage']:empty {
        display: none;
      }
    `}
`;

const StyledHelp = styled(Help)`
  color: ${(props) => props.theme.color.primaryBlue};
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
`;

const ProjectFieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  uiSchema,
  formContext,
  id,
}) => {
  const uiTitle =
    uiSchema?.['ui:label'] || uiSchema?.['ui:title']
      ? `${uiSchema?.['ui:label'] ?? uiSchema?.['ui:title']}`
      : null;
  const fieldName = id?.split('_')?.[1];
  const hidden = uiSchema?.['ui:widget'] === 'HiddenWidget' || false;

  const showErrorHint = formContext?.showErrorHint ?? false;
  const { errorColor, __errors: formContextErrors } =
    formContext?.errors?.[fieldName] || {};
  const hasFormContextError = formContextErrors?.length > 0;
  const showError = hasFormContextError && showErrorHint;

  return (
    <>
      {!hidden && (
        <StyledContainer>
          {uiTitle && <StyledH4>{uiTitle}</StyledH4>}
          <StyledInputWrapper errorColor={errorColor} hasError={showError}>
            <div>{children}</div>
            {showError && (
              <Tooltip title={formContextErrors?.join()}>
                <StyledHelp />
              </Tooltip>
            )}
          </StyledInputWrapper>
        </StyledContainer>
      )}
    </>
  );
};

export default ProjectFieldTemplate;
