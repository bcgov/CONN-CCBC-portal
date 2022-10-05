import { FieldTemplateProps } from '@rjsf/core';
import Description from './components/Description';
import FieldLabel from './components/FieldLabel';

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
    </div>
  );
};

export default FieldTemplate;
