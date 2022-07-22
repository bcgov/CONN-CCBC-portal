const authorizedContact = {
  authorizedContact: {
    title: 'Authorized contact',
    description:
      'The authorized contact should have full authority to bind said organization through Funding Agreements. One primary contact must be identified for applications submitted on behalf of multiple organizations.',
    type: 'object',
    required: [
      'authGivenName',
      'authPostionTitle',
      'authEmail',
      'authTelephone',
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
        type: 'string',
      },
      authExtension: {
        title: 'Extension',
        type: 'string',
      },
      isAuthContactSigningOfficer: {
        title: 'Is this person an authorized signing officer of the Applicant?',
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
      },
    },
  },
};

export default authorizedContact;
