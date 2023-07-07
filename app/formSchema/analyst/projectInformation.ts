import { JSONSchema7 } from 'json-schema';

const projectInformation: JSONSchema7 = {
  title: 'Project information',
  description: '',
  type: 'object',
  required: [
    'dateFundingAgreementSigned',
    'fundingAgreementUpload',
    'statementOfWorkUpload',
  ],
  properties: {
    hasFundingAgreementBeenSigned: {
      title: 'Has the funding agreement been signed?',
      type: 'boolean',
      enum: [true, false],
      default: false,
    },
  },
  dependencies: {
    hasFundingAgreementBeenSigned: {
      oneOf: [
        {
          properties: {
            hasFundingAgreementBeenSigned: {
              enum: [false],
            },
          },
        },
        {
          properties: {
            hasFundingAgreementBeenSigned: {
              enum: [true],
            },
            dateFundingAgreementSigned: {
              type: 'string',
            },
            fundingAgreementUpload: {
              title:
                'Upload the Funding Agreement signed by both the Recipient & Province',
              type: 'string',
            },
            statementOfWorkUpload: {
              title: 'Upload the completed statement of work Excel file',
              type: 'string',
            },
            sowWirelessUpload: {
              title: 'Upload the SOW Wireless Tbl Excel file, if necessary',
              type: 'string',
            },
            finalizedMapUpload: {
              title: 'Upload the finalized map, if available',
              type: 'string',
            },
          },
        },
      ],
    },
  },
};

export default projectInformation;
