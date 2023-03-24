import { ObjectFieldTemplateProps } from '@rjsf/core';

const ProjectObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  properties,
}) => {
  return <>{properties.map((prop) => prop.content)}</>;
};

export default ProjectObjectFieldTemplate;
