import { FieldProps } from '@rjsf/core';
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
  const hasErrors = useMemo(
    () => Object.keys(errorSchema || {}).length > 0,
    [errorSchema]
  );
  const allowAnalystEdit = uiOptions?.allowAnalystEdit;
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
