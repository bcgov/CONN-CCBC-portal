import { JSONSchema7 } from 'json-schema';

const projectInformation: JSONSchema7 = {
  title: 'Project information',
  description: '',
  type: 'object',
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
            main: {
              type: 'object',
              required: ['dateFundingAgreementSigned'],
              properties: {
                dateFundingAgreementSigned: {
                  type: 'string',
                },
                upload: {
                  type: 'object',
                  required: ['fundingAgreementUpload', 'statementOfWorkUpload'],
                  properties: {
                    fundingAgreementUpload: {
                      title:
                        'Upload the Funding Agreement signed by both the Recipient & Province',
                      type: 'string',
                    },
                    statementOfWorkUpload: {
                      title:
                        'Upload the completed statement of work Excel file',
                      type: 'string',
                    },
                    finalizedMapUpload: {
                      title: 'Upload the finalized map, if available',
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default projectInformation;
