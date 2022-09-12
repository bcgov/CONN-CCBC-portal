import { FieldProps, utils } from '@rjsf/core';

const DefaultSchemaField = utils.getDefaultRegistry().fields.SchemaField;

const ReviewSchemaField: React.FC<FieldProps> = (props) => {
  const before = props.uiSchema?.['ui:before'];
  const after = props.uiSchema?.['ui:after'];
  return (
    <>
      {before}
      <DefaultSchemaField {...props} />
      {after}
    </>
  );
};

export default ReviewSchemaField;
