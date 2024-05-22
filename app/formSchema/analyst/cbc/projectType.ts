import { RJSFSchema } from '@rjsf/utils';

const projectType: RJSFSchema = {
  title: 'Project type',
  description: '',
  type: 'object',
  properties: {
    projectType: {
      type: 'string',
      title: 'Project Type',
      enum: [null, 'Transport', 'Highway', 'Last Mile'],
    },
    transportProjectType: {
      type: 'string',
      title: 'Transport Project Type',
      enum: [null, 'Fibre', 'Microwave'],
    },
    highwayProjectType: {
      type: 'string',
      title: 'Highway Project Type',
    },
    lastMileProjectType: {
      type: 'string',
      title: 'Last Mile Project Type',
      enum: [null, 'Fibre', 'Coaxial', 'LTE'],
    },
    lastMileMinimumSpeed: {
      type: 'string',
      title: 'Last Mile Minimum Speed',
      enum: [null, 25, 50],
    },
    connectedCoastNetworkDependant: {
      type: 'string',
      title: 'Connected Coast Network Dependant',
      enum: [null, 'Yes', 'No'],
    },
  },
};

export default projectType;
