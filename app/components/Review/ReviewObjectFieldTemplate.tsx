import { ObjectFieldTemplateProps } from '@rjsf/utils';

const ReviewObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  properties,
}) => {
  return <>{properties.map((prop) => prop.content)}</>;
};

export default ReviewObjectFieldTemplate;
