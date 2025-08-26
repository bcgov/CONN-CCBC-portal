import { FieldTemplateProps } from '@rjsf/utils';
import React from 'react';
import { StyledColLeft, StyledColRight } from 'components/Review/Components';
import { Help } from '@mui/icons-material';
import styled from 'styled-components';
import { Tooltip } from '@mui/material';

const StyledHelp = styled(Help)`
  color: ${(props) => props.theme.color.primaryBlue};
  float: right;
  cursor: pointer;
`;

const StyledSpan = styled.span`
  color: ${(props) => props.theme.color.disabledGrey};
`;

interface StyledRowProps {
  isSubField?: boolean;
  children?: React.ReactNode;
}

const StyledRow = styled.tr<StyledRowProps>`
  border-top: ${(props) =>
    props.isSubField ? 'none' : '1px solid rgba(0, 0, 0, 0.16)'};
`;

const ReviewFieldTemplate: React.FC<FieldTemplateProps> = ({
  id,
  formContext,
  schema,
  uiSchema,
  children,
  rawErrors,
}) => {
  if (uiSchema?.['ui:hidden']) return null;

  if (
    id === 'root' ||
    uiSchema?.['ui:field'] === 'SectionField' ||
    uiSchema?.['ui:field'] === 'ReviewCheckboxField' ||
    schema.type === 'array' ||
    schema.type === 'object'
  )
    return children;

  const fieldTitle =
    (uiSchema?.['ui:options']?.customTitle as React.JSX.Element) ??
    schema.title;

  const isExcludeTableFormat = uiSchema?.['ui:options']?.excludeTableFormat;

  if (isExcludeTableFormat) {
    return <>{children}</>;
  }

  const before = uiSchema?.['ui:before'];
  const after = uiSchema?.['ui:after'];
  const fieldName = id?.split('_')?.[2];
  const pageName = id?.split('_')?.[1];
  const showErrorHint = formContext?.showErrorHint ?? false;
  const editMode = formContext?.editMode;
  const hideTitleInEditMode = uiSchema?.['ui:hidetitleineditmode'];
  const showTitle = !(editMode === true && hideTitleInEditMode === true);
  const title = showTitle ? fieldTitle : null;
  const isSubField = (uiSchema?.['ui:options']?.isSubField as boolean) ?? false;

  const formErrorSchema = formContext?.formErrorSchema ?? formContext.errors;
  const {
    errorColor,
    errorTextColor,
    __errors: formContextErrors,
  } = formErrorSchema?.[pageName]?.[fieldName] || {};
  const hasFormContextError = formContextErrors?.length > 0;
  const isErrors = (rawErrors && rawErrors.length > 0) || !!hasFormContextError;
  // check if the field is in the rfi list so we can display rfi files for required fields that have an error
  const isFieldInRfi = formContext?.rfiList?.some((rfi) =>
    Object.keys(rfi?.jsonData?.rfiAdditionalFiles || []).includes(fieldName)
  );
  const hasError = isErrors && !isFieldInRfi;
  const fallBackField = formContext?.fallBackFields?.[fieldName];

  return (
    <>
      {before}
      <StyledRow isSubField={isSubField}>
        {showTitle && title && (
          <StyledColLeft id={`${id}_title`}>
            {isSubField ? '\u2003\u2003> ' : ''}
            {title}
          </StyledColLeft>
        )}
        <StyledColRight
          data-testid={`${id}-value`}
          hasError={hasError}
          errorColor={errorColor}
          errorTextColor={errorTextColor}
          hideColLeft={hideTitleInEditMode}
        >
          {!showTitle && fieldTitle}
          {fallBackField && <StyledSpan>{fallBackField}</StyledSpan>}
          {children}
          {hasError && showErrorHint && hasFormContextError && (
            <Tooltip
              title={
                <span style={{ whiteSpace: 'pre-line' }}>
                  {formContextErrors.join('\n')}
                </span>
              }
              placement="top"
            >
              <StyledHelp />
            </Tooltip>
          )}
        </StyledColRight>
      </StyledRow>
      {after}
    </>
  );
};

export default ReviewFieldTemplate;
