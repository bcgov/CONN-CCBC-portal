import { JSONSchema7 } from 'json-schema';

const rfi = {
  title: '',
  type: 'object',
  required: [
    'rfiType',
    'rfiDueBy',
    'rfiEmailCorrespondance',
    'rfiAdditionalFiles',
  ],
  properties: {
    rfiType: {
      title: 'RFI type',
      type: 'array',
      items: {
        type: 'string',
        enum: ['Missing files or information', 'Technical'],
      },
      uniqueItems: true,
    },
    rfiDueBy: {
      title: 'Due by',
      type: 'string',
    },
    rfiEmailCorrespondance: {
      title: 'Email correspondence',
      type: 'string',
    },
    rfiAdditionalFiles: {
      title: 'Request replacement or additional files',
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'Template 1 - Eligibility & impacts Calculator',
          'Template 2 - Detailed Budget',
          'Template 3 - Financial Forecast',
          'Template 4 - Last Mile Internet Service Offering',
          'Template 5 - List of Points of Presence and Wholesale Pricing',
          'Template 6 - Community and Rural Development Benefits',
          'Template 7 - Wireless Addendum',
          'Template 8 - Supporting Connectivity Evidence',
          'Template 9 - Backbone & Geographic Names',
          'Template 10 - Equipment Details',
          'Copies of registration and other relevant documents ',
          'Financial statements',
          'Logical Network Diagram',
          'Project schedule',
          'Benefits supporting documents',
          'Other supporting materials',
          'Coverage map from Eligibility Mapping Tool',
          'Coverage Assessment and Statistics',
          'Current network infrastructure',
          'Proposed or Upgraded Network Infrastructure',
        ],
      },
      uniqueItems: true,
    },
  },
} as Record<string, JSONSchema7>;

export default rfi;
