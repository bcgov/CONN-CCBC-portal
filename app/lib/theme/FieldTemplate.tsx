import { FieldTemplateProps } from '@rjsf/core';
import FieldLabel from './components/FieldLabel';
import styled from 'styled-components';
import { useMemo } from 'react';

const StyledH3 = styled('h3')`
  font-size: 21px;
  font-weight: 400;
  line-height: 24.61px;
`;

const FieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  errors,
  rawErrors,
  label,
  displayLabel,
  required,
  uiSchema,
  rawDescription,
  schema,
  id,
}) => {
  const hideOptional = uiSchema['ui:options']?.hideOptional;
  const altOptionalText = uiSchema['ui:options']?.altOptionalText;
  const customTitle = uiSchema['ui:options']?.customTitle as JSX.Element;
  const showLabel = displayLabel && !customTitle;

  /**
   * rjsf's DescriptionField does not have access to the schema,
   * so we need to use the rawDescription and implement the description field logic here instead
   */
  const description = useMemo(() => {
    if (!rawDescription) return null;

    if (schema?.type === 'object' || schema?.type === 'array')
      return <StyledH3>{rawDescription}</StyledH3>;

    return <div>{rawDescription}</div>;
  }, [rawDescription, schema]);

  return (
    <div>
      {showLabel && (
        <FieldLabel
          label={label}
          altOptionalText={altOptionalText && String(altOptionalText)}
          hideOptional={hideOptional && true}
          required={required}
          htmlFor={id}
        />
      )}
      {customTitle}
      {description}
      {children}
      {rawErrors && rawErrors.length > 0 ? (
        <div className="error-div">
          <>{errors}</>
        </div>
      ) : null}
    </div>
  );
};

export default FieldTemplate;
