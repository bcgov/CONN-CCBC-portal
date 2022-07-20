const alternateContact = {
  alternateContact: {
    title: 'Alternate contact',
    description:
      'Provide the contact information for an alternate contact in the event that the primary contact becomes unreachable. If there is no alternate contact, leave this section blank.',
    type: 'object',
    required: [
      'altFamilyName',
      'altPostionTitle',
      'altEmail',
      'altTelephone',
      'isAltContactSigningOfficer',
      'isAltFirstContact',
    ],
    properties: {
      altFamilyName: {
        title: 'Family name',
        type: 'string',
      },
      altGivenName: {
        title: 'Given name',
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
        title: 'Extension',
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
