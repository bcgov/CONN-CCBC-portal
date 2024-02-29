import { RJSFSchema } from '@rjsf/utils';

const authorizedContact = {
  authorizedContact: {
    title: 'Authorized business contact',
    description:
      'The authorized contact should have full authority to bind said organization through Funding Agreements. One primary contact must be identified for applications submitted on behalf of multiple organizations.',
    type: 'object',
    required: [
      'authGivenName',
      'authPositionTitle',
      'authEmail',
      'authTelephone',
      'isAuthContactSigningOfficer',
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
      authPositionTitle: {
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
        maxLength: 9,
      },
      isAuthContactSigningOfficer: {
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

export default authorizedContact;
