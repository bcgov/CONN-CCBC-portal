import { FieldProps } from '@rjsf/core';

const TrackingSectionField: React.FC<FieldProps> = (props) => {
  const { registry } = props;

  return (
    <table>
      <tbody>
        <registry.fields.ObjectField {...props} />
      </tbody>
    </table>
  );
};

export default TrackingSectionField;
