import { FieldTemplateProps } from '@rjsf/core';
import styled from 'styled-components';
import Description from './components/Description';
import FieldLabel from './components/FieldLabel';

const StyledHR = styled.hr`
  margin-top: ${(props) => props.theme.spacing.large};
  margin-bottom: ${(props) => props.theme.spacing.large};
`;

const FieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  errors,
  rawErrors,
  label,
  displayLabel,
  formContext,
  required,
  uiSchema,
  rawDescription,
  schema,
  id,
}) => {
  const hideOptional = uiSchema['ui:options']?.hideOptional;
  const boldTitle = uiSchema['ui:options']?.boldTitle as boolean;
  const showCreatedAt = Boolean(uiSchema['ui:options']?.showCreatedAt);
  const altOptionalText = uiSchema['ui:options']?.altOptionalText;
  const customTitle = uiSchema['ui:options']?.customTitle as JSX.Element;
  const isAddHorizontalLine = uiSchema['ui:options']
    ?.addHorizontalLine as boolean;
  const showLabel = displayLabel && !customTitle;
  const createdAt = formContext?.createdAt;

  return (
    <div>
      {showLabel && (
        <FieldLabel
          bold={boldTitle}
          createdAt={createdAt}
          showCreatedAt={showCreatedAt}
          label={label}
          altOptionalText={altOptionalText && String(altOptionalText)}
          hideOptional={hideOptional && true}
          required={required}
          htmlFor={id}
        />
      )}
      {customTitle}
      {/*
        For objects, the description is rendered in the ObjectFieldTemplate,
        as displayLabel will be false and we want the description to be below the label
      */}
      {schema.type !== 'object' && (
        <Description rawDescription={rawDescription} schema={schema} />
      )}
      {children}
      {rawErrors && rawErrors.length > 0 ? (
        <div className="error-div">{errors}</div>
      ) : null}
      {isAddHorizontalLine && <StyledHR />}
    </div>
  );
};

export default FieldTemplate;
