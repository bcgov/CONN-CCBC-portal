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
  const hasErrors = useMemo(
    () => Object.keys(errorSchema || {}).length > 0 || !!hasFormContextError,
    [errorSchema, hasFormContextError]
  );
  const allowAnalystEdit =
    uiOptions?.allowAnalystEdit && (formContext.isEditable ?? true);
  return (
    <Accordion
      id={idSchema.$id}
      name={name}
      defaultToggled={uiOptions.defaultExpanded || hasErrors}
      toggled={formContext.toggleOverride}
      error={hasErrors}
      title={schema.title}
      allowAnalystEdit={allowAnalystEdit}
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
