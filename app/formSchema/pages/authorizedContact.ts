const authorizedContact = {
  authorizedContact: {
    title: 'Authorized contact',
    description: 'Provide the contact information for the authorized contact',
    type: 'object',
    required: [
      'authFamilyName',
      'authPostionTitle',
      'authEmail',
      'authTelephone',
      'isFirstContact',
    ],
    properties: {
      authFamilyName: {
        title: 'Family name of person who will be the authorized contact',
        type: 'string',
      },
      authGivenName: {
        title: 'Given name of person who will be the authorized contact',
        type: 'string',
      },
      authPostionTitle: {
        title: 'Position/title',
        type: 'string',
      },
      authEmail: {
        title: 'Email',
        type: 'string',
      },
      authTelephone: {
        title: 'Telephone',
        type: 'number',
      },
      authExtension: {
        title: 'Extension',
        type: 'number',
      },
      isAuthContactSigningOfficer: {
        title: 'Is this person an authorized signing officer of the applicant?',
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
      },
      isFirstContact: {
        title:
          'Contact this person for communication regarding the application',
        type: 'boolean',
      },
    },
  },
};

export default authorizedContact;
