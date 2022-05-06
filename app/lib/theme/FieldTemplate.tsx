import { FieldTemplateProps } from '@rjsf/core';
import FieldLabel from './widgets/FieldLabel';

const FieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  errors,
  help,
  rawErrors,
  label,
  displayLabel,
  required,
  id,
}) => {
  return (
    <div>
      {displayLabel && (
        <FieldLabel label={label} required={required} htmlFor={id} />
      )}
      {help}
      {children}

      <div className="error-div">
        {rawErrors && rawErrors.length > 0 ? <>{errors}</> : null}
      </div>
    </div>
  );
};
