import { FieldProps } from '@rjsf/core';

const TrackingSectionField: React.FC<FieldProps> = (props) => {
  const { registry } = props;

  return <registry.fields.ObjectField {...props} />;
};

export default TrackingSectionField;
