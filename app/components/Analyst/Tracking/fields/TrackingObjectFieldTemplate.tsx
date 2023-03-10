import { ObjectFieldTemplateProps } from '@rjsf/core';

const TrackingObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  properties,
}) => <>{properties.map((prop) => prop.content)}</>;

export default TrackingObjectFieldTemplate;
