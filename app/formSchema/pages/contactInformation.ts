import { RJSFSchema } from '@rjsf/utils';

const contactInformation: Record<string, RJSFSchema> = {
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
