const authorizedContact = {
  authorizedContact: {
    title: 'Authorized contact',
    description: 'Provide the contact information for the authorized contact',
    type: 'object',
    properties: {
      authFamilyName: {
        title: 'Family name of person who will be the authorized contact',
        type: 'string',
      },
      authGivenName: {
        title:
          'Given name of person who will be the authorized contact (optional)',
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
        title: 'Extension (optional)',
        type: 'number',
      },
      isAuthContactSigningOfficer: {
        title: 'Is this person an authorized signing officer of the applicant?',
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
      },
    },
  },
};

export default authorizedContact;
