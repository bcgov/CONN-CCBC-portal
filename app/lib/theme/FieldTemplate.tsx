import { FieldTemplateProps } from '@rjsf/core';
import FieldLabel from './widgets/FieldLabel';
import {
  GeographicArea,
  GeographicCoverageMap,
  HouseholdsImpactedIndigenous,
  IndigenousEntity,
  NumberOfHouseholds,
  ProjectBenefits,
  SupportingDocuments,
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
  const hideOptional = uiSchema['ui:options']?.hideOptional;
  const altOptionalText = uiSchema['ui:options']?.altOptionalText;
  const showLabel = displayLabel && uiSchema['ui:options']?.label;

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
      {label === 'geographicArea' && <GeographicArea />}
      {/* using id root_geographicCoverageMap for now since I wanted to keep the description in as it is
      being used for the review page though may be able to remove depending on how review rebuild works */}
      {id === 'root_geographicCoverageMap' && <GeographicCoverageMap />}
      {label === 'isIndigenousEntity' && <IndigenousEntity />}
      {label === 'projectBenefits' && <ProjectBenefits />}
      {label === 'numberOfHouseholds' && <NumberOfHouseholds />}
      {label === 'householdsImpactedIndigenous' && (
        <HouseholdsImpactedIndigenous />
      )}
      {label === 'Supporting documents' && <SupportingDocuments />}
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
