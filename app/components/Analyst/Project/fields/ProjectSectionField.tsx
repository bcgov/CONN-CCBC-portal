import { FieldProps } from '@rjsf/utils';

const ProjectSectionField: React.FC<FieldProps> = (props) => {
  const { registry } = props;

  return <registry.fields.ObjectField {...props} />;
};

export default ProjectSectionField;
