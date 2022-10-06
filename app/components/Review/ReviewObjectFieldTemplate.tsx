import { ObjectFieldTemplateProps } from '@rjsf/core';

const ReviewObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = (
  props
) => <>{props.properties.map((prop) => prop.content)}</>;

export default ReviewObjectFieldTemplate;
