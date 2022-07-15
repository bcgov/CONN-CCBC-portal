const authorizedContact = {
  authorizedContact: {
    title: 'Authorized contact',
    description:
      'The authorized contact should have full authority to bind said organization through funding agreements. One primary contact must be identified for applications submitted on behalf of multiple organizations.',
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
        title: 'Family name',
        type: 'string',
      },
      authGivenName: {
        title: 'Given name',
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
    },
  },
};

export default authorizedContact;
