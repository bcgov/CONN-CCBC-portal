import { RJSFSchema } from '@rjsf/utils';

const dependency: RJSFSchema = {
  title: 'Dependency',
  description: '',
  type: 'object',
  required: ['connectedCoastNetworkDependent', 'crtcProjectDependent'],
  properties: {
    connectedCoastNetworkDependent: {
      type: 'string',
      title: 'Connected Coast Network Dependent',
    },
    crtcProjectDependent: {
      type: 'string',
      title: 'CRTC Project Dependent',
    },
  },
};

export default dependency;
