import { JSONSchema7 } from 'json-schema';

const projectInformation: JSONSchema7 = {
  title: 'Project information',
  description: '',
  type: 'object',
  properties: {
    main: {
      title: '',
      type: 'object',
      required: [
        'dateFundingAgreementSigned',
        'fundingAgreementUpload',
        'statementOfWorkUpload',
      ],
      properties: {
        upload: {
          type: 'object',
          properties: {
            fundingAgreementUpload: {
              title:
                'Upload the Funding Agreement signed by both the Recipient & Province',
              type: 'string',
            },
            statementOfWorkUpload: {
              title: 'Upload the completed statement of work tables',
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
        dateFundingAgreementSigned: {
          type: 'string',
        },
      },
    },
  },
};

export default projectInformation;
