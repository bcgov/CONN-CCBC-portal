import { FieldTemplateProps } from '@rjsf/core';
import FieldLabel from './widgets/FieldLabel';
import {
  HouseholdsImpactedIndigenous,
  IndigenousEntity,
  NumberOfHouseholds,
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
      {label === 'numberOfHouseholds' && <NumberOfHouseholds />}
      {label === 'householdsImpactedIndigenous' && (
        <HouseholdsImpactedIndigenous />
      )}
      {help}
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
