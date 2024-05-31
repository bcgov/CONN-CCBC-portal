import { RJSFSchema } from '@rjsf/utils';

const cbcTombstone: RJSFSchema = {
  title: 'Tombstone',
  description: '',
  type: 'object',
  properties: {
    projectNumber: {
      type: 'string',
      title: 'Project Number',
    },
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
      enum: [null, '1', '2', '3', '4', '5', '6'],
    },
    projectStatus: {
      type: 'string',
      title: 'Project Status',
    },
    projectTitle: {
      type: 'string',
      title: 'Project Title',
    },
    projectDescription: {
      type: 'string',
      title: 'Project Description',
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
      title: '$8.30 Million Funding',
      enum: [null, 'Yes', 'No'],
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
