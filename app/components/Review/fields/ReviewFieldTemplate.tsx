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

  const title =
    (uiSchema?.['ui:options']?.customTitle as JSX.Element) ?? schema.title;

  const isExcludeTableFormat = uiSchema?.['ui:options']?.excludeTableFormat;

  if (isExcludeTableFormat) {
    return <>{children}</>;
  }

  const before = uiSchema?.['ui:before'];
  const after = uiSchema?.['ui:after'];
  const fieldName = id?.split('_')?.[2];
  const pageName = id?.split('_')?.[1];
  const showErrorHint = formContext?.showErrorHint ?? false;

  const formErrorSchema = formContext?.formErrorSchema ?? formContext.errors;
  const { errorColor, __errors: formContextErrors } =
    formErrorSchema?.[pageName]?.[fieldName] || {};
  const hasFormContextError = formContextErrors?.length > 0;
  const isErrors = (rawErrors && rawErrors.length > 0) || !!hasFormContextError;
  // check if the field is in the rfi list so we can display rfi files for required fields that have an error
  const isFieldInRfi = formContext?.rfiList?.some((rfi) =>
    Object.keys(rfi?.jsonData?.rfiAdditionalFiles || []).includes(fieldName)
  );
  const hasError = isErrors && !isFieldInRfi;

  return (
    <>
      {before}
      <tr>
        <StyledColLeft id={`${id}_title`}>{title}</StyledColLeft>
        <StyledColRight
          data-testid={`${id}-value`}
          hasError={hasError}
          errorColor={errorColor}
        >
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
      </tr>
      {after}
    </>
  );
};

export default ReviewFieldTemplate;
