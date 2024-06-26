import { RJSFSchema } from '@rjsf/utils';

const alternateContact = {
  alternateContact: {
    title: 'Alternate business contact',
    description:
      'Provide the business contact information for an alternate contact in the event that the primary contact becomes unreachable. If there is no alternate contact, leave this section blank.',
    type: 'object',
    required: [
      'altGivenName',
      'altPositionTitle',
      'altEmail',
      'altTelephone',
      'isAltContactSigningOfficer',
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
      altPositionTitle: {
        title: 'Position/title',
        type: 'string',
      },
      altEmail: {
        title: 'Email',
        type: 'string',
      },
      altTelephone: {
        title: 'Telephone',
        type: 'string',
      },
      altExtension: {
        title: 'Extension',
        type: 'string',
        maxLength: 9,
      },
      isAltContactSigningOfficer: {
        title: 'Is this person an authorized signing officer of the Applicant?',
        type: 'boolean',
        oneOf: [
          { const: true, title: 'Yes' },
          { const: false, title: 'No' },
        ],
      },
    },
  },
} as Record<string, RJSFSchema>;

export default alternateContact;
