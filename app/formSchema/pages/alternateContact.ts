const alternateContact = {
  alternateContact: {
    title: 'Alternate contact',
    description: 'Provide the contact information for the alternate contact',
    type: 'object',
    properties: {
      altFamilyName: {
        title: 'Family name of person who will be the alternate contact',
        type: 'string',
      },
      altGivenName: {
        title: 'Given name of person who will be the alternate contact',
        type: 'string',
      },
      altPostionTitle: {
        title: 'Position/title',
        type: 'string',
      },
      altEmail: {
        title: 'Email',
        type: 'string',
      },
      altTelephone: {
        title: 'Telephone',
        type: 'number',
      },
      altExtension: {
        title: 'Extension (optional)',
        type: 'number',
      },
      isAltContactSigningOfficer: {
        title: 'Is this person an authorized signing officer of the applicant?',
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
      },
    },
  },
};

export default alternateContact;
