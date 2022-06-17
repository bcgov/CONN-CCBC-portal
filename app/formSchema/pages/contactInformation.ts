const contactInformation = {
  contactInformation: {
    title: 'Organization contact information',
    description: 'Provide the contact information for your organization',
    type: 'object',
    required: ['contactTelephoneNumber'],
    properties: {
      contactTelephoneNumber: {
        title: 'Telephone number',
        type: 'number',
      },
      contactExtension: {
        title: 'Extension',
        type: 'number',
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
