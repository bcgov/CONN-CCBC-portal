import { FieldTemplateProps } from '@rjsf/core';
import React from 'react';
import { StyledColLeft, StyledColRight, StyledColError } from '../index';

const ReviewFieldTemplate: React.FC<FieldTemplateProps> = ({
  id,
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

  return (
    <>
      {before}
      <tr>
        <StyledColLeft id={id}>{title}</StyledColLeft>
        {rawErrors && rawErrors.length > 0 ? (
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
