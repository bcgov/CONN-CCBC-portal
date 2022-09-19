import { FieldTemplateProps } from '@rjsf/core';
import React from 'react';
import styled from 'styled-components';

const StyledColLeft = styled('th')`
  // Todo: workaround for Jest styled component theme prop error
  // background-color: ${(props) => props.theme.color.backgroundGrey};
  background-color: '#F2F2F2';
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-left: 0;
  font-weight: 400;
  white-space: pre-line;
  vertical-align: top;
`;

const StyledColRight = styled('td')`
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-right: 0;
  font-weight: 400;
  white-space: pre-line;
`;

const StyledColError = styled(StyledColRight)`
  background-color: rgba(248, 214, 203, 0.4);
  // background-color: ${(props) => props.theme.color.errorBackground};
`;

const ReviewFieldTemplate: React.FC<FieldTemplateProps> = ({
  id,
  schema,
  uiSchema,
  children,
  errors,
}) => {
  if (uiSchema?.['ui:hidden']) return null;

  if (
    id === 'root' ||
    uiSchema?.['ui:field'] === 'SectionField' ||
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
        {errors ? (
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
