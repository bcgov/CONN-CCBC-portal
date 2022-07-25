import { FieldTemplateProps } from '@rjsf/core';
import FieldLabel from './widgets/FieldLabel';
import {
  IndigenousEntity,
  ProjectBenefits,
} from '../../components/Form/CustomTitles';

const FieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  errors,
  help,
  rawErrors,
  label,
  displayLabel,
  required,
  uiSchema,
  id,
}) => {
  const ignoreOptional = uiSchema['ui:options']?.ignoreOptional;

  return (
    <div>
      {displayLabel && (
        <FieldLabel
          label={label}
          ignoreOptional={ignoreOptional && true}
          required={required}
          htmlFor={id}
        />
      )}
      {label === 'isIndigenousEntity' && <IndigenousEntity />}
      {label === 'projectBenefits' && <ProjectBenefits />}
      {help}
      {children}

      <div className="error-div">
        {rawErrors && rawErrors.length > 0 ? <>{errors}</> : null}
      </div>
    </div>
  );
};

export default FieldTemplate;
