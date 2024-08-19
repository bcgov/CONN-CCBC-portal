import { RJSFSchema } from '@rjsf/utils';

const cbcTombstone: RJSFSchema = {
  title: 'Tombstone',
  description: '',
  type: 'object',
  required: ['applicantContractualName', 'currentOperatingName'],
  properties: {
    originalProjectNumber: {
      type: 'string',
      title: 'Original Project Number',
    },
    phase: {
      type: 'string',
      title: 'Project Phase',
      enum: ['1', '2', '3', '4', '4b'],
    },
    intake: {
      type: 'string',
      title: 'Intake',
      enum: [null, 1, 2, 3, 4],
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
      enum: [
        null,
        'CRTC Broadband Fund',
        'ISED-CTI',
        'ISED-UBF Core',
        'ISED-UBF RRS',
      ],
    },
    federalProjectNumber: {
      type: 'string',
      title: 'Federal Project Number',
    },
  },
};

export default cbcTombstone;
