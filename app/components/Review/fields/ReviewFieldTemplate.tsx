import { FieldTemplateProps } from '@rjsf/utils';
import React from 'react';
import {
  StyledColLeft,
  StyledColRight,
  StyledColError,
} from 'components/Review/Components';

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

  const before = uiSchema?.['ui:before'];
  const after = uiSchema?.['ui:after'];
  const fieldName = id?.split('_')?.[2];
  const pageName = id?.split('_')?.[1];

  const formErrorSchema = formContext?.formErrorSchema ?? formContext.errors;
  const hasFormContextError =
    formErrorSchema?.[pageName]?.[fieldName]?.__errors?.length > 0;
  const isErrors = (rawErrors && rawErrors.length > 0) || !!hasFormContextError;
  // check if the field is in the rfi list so we can display rfi files for required fields that have an error
  const isFieldInRfi = formContext?.rfiList?.some((rfi) =>
    Object.keys(rfi?.jsonData?.rfiAdditionalFiles || []).includes(fieldName)
  );

  return (
    <>
      {before}
      <tr>
        <StyledColLeft id={id}>{title}</StyledColLeft>
        {isErrors && !isFieldInRfi ? (
          <StyledColError />
        ) : (
          <StyledColRight id={`${id}-value`}>{children}</StyledColRight>
        )}
      </tr>
      {after}
    </>
  );
};

export default ReviewFieldTemplate;
