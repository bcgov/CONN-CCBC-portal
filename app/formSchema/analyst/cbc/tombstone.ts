import { RJSFSchema } from '@rjsf/utils';

const cbcTombstone: RJSFSchema = {
  title: 'Tombstone',
  description: '',
  type: 'object',
  properties: {
    originalProjectNumber: {
      type: 'string',
      title: 'Original Project Number',
    },
    applicantContractualName: {
      type: 'string',
      title: 'Applicant Contractual Name',
    },
    currentOperatingName: {
      type: 'string',
      title: 'Current Operating Name',
    },
    eightThirtyMillionFunding: {
      type: 'string',
      title: '$830 Million Funding',
      oneOf: [
        { const: true, title: 'Yes' },
        { const: false, title: 'No' },
      ],
    },
    federalFundingSource: {
      type: 'string',
      title: 'Federal Funding Source',
      enum: [null, 'CRTC', 'CTI', 'UBF', 'UBF RRS'],
    },
    federalProjectNumber: {
      type: 'string',
      title: 'Federal Project Number',
    },
  },
};

export default cbcTombstone;
