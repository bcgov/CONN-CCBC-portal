import { JSONSchema7 } from 'json-schema';

const contactInformation: Record<string, JSONSchema7> = {
  contactInformation: {
    title: 'Organization contact information',
    description: 'Provide the contact information for your organization',
    type: 'object',
    required: ['contactTelephoneNumber'],
    properties: {
      contactTelephoneNumber: {
        title: 'Telephone number',
        type: 'string',
      },
      contactExtension: {
        title: 'Extension',
        type: 'string',
        maxLength: 9,
      },
      contactEmail: {
        title: 'Email',
        type: 'string',
      },
      contactWebsite: {
        title: 'Website',
        type: 'string',
      },
    },
  },
};

export default contactInformation;
