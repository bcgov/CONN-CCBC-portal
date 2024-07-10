import { RJSFSchema } from '@rjsf/utils';

const projectType: RJSFSchema = {
  title: 'Project type',
  description: '',
  type: 'object',
  required: ['projectType'],
  properties: {
    projectType: {
      type: 'string',
      title: 'Project Type',
      enum: [
        null,
        'Cellular',
        'Last-Mile',
        'Last-Mile & Cellular',
        'Last-Mile & Transport',
        'Plan',
        'Transport',
      ],
    },
    transportProjectType: {
      type: 'string',
      title: 'Transport Project Type',
      enum: [null, 'Fibre', 'Microwave'],
    },
    highwayProjectType: {
      type: 'string',
      title: 'Highway Project Type',
      enum: [null, 'Cellular', 'Emergency Call Boxes', 'Rest Areas Wi-Fi'],
    },
    lastMileProjectType: {
      type: 'string',
      title: 'Last Mile Project Type',
      enum: [
        null,
        'Fibre',
        'Coaxial',
        'LTE',
        'Fibre & Coaxial',
        'Fibre & Fixed Wireless',
        'Fixed Wireless',
        'Fixed Wireless (LTE)',
        'Upgrade Coax & Wireless',
        'Upgrade DSL',
        'Upgrade Wireless',
      ],
    },
    lastMileMinimumSpeed: {
      type: 'string',
      title: 'Last Mile Minimum Speed',
      enum: [null, 25, 50],
    },
    connectedCoastNetworkDependant: {
      type: 'string',
      title: 'Connected Coast Network Dependant',
      oneOf: [
        { const: true, title: 'Yes' },
        { const: false, title: 'No' },
      ],
    },
  },
};

export default projectType;
