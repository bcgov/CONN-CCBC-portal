import { FieldProps } from '@rjsf/utils';
import Accordion from 'components/Review/Accordion';
import { useMemo } from 'react';

const ReviewSectionField: React.FC<FieldProps> = (props) => {
  const {
    idSchema,
    name,
    uiSchema,
    registry,
    schema,
    errorSchema,
    formContext,
  } = props;
  const uiOptions = uiSchema['ui:options'] || {};
  const pageName = idSchema.$id?.split('_')?.[1];
  const formErrorSchema = formContext?.formErrorSchema ?? formContext.errors;
  const hasFormContextError = formErrorSchema?.[pageName];
  const sectionErrors = hasFormContextError?.__errors;
  const hasErrors = useMemo(
    () => Object.keys(errorSchema || {}).length > 0 || !!hasFormContextError,
    [errorSchema, hasFormContextError]
  );
  const toggledSection = formContext?.toggledSection === pageName;
  const allowAnalystEdit =
    uiOptions?.allowAnalystEdit && (formContext.isEditable ?? true);
  return (
    <Accordion
      id={idSchema.$id}
      name={name}
      defaultToggled={uiOptions.defaultExpanded || hasErrors || toggledSection}
      focused={toggledSection}
      toggled={formContext.toggleOverride}
      cbcId={formContext.cbcId}
      isCBC={formContext.isCBC}
      error={hasErrors}
      sectionErrors={sectionErrors}
      title={schema.title}
      allowAnalystEdit={allowAnalystEdit}
      recordLocked={formContext.recordLocked}
    >
      <table>
        <tbody>
          <registry.fields.ObjectField {...props} />
        </tbody>
      </table>
    </Accordion>
  );
};

export default ReviewSectionField;
