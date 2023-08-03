import { JSONSchema7 } from 'json-schema';

const conditionalApproval: JSONSchema7 = {
  title: 'Conditional approval',
  description: '',
  type: 'object',
  properties: {
    decision: {
      title: `Minister's decision`,
      type: 'object',
      required: ['ministerDecision', 'ministerDate', 'ministerAnnouncement'],
      properties: {
        ministerDecision: {
          type: 'string',
          enum: ['Approved', 'Not approved', 'Hold'],
        },
        ministerDate: {
          type: 'string',
        },
        ministerAnnouncement: {
          type: 'string',
          enum: ['Announce immediately', 'Hold announcement'],
        },
        provincialRequested: {
          type: 'number',
        },
      },
    },
    isedDecisionObj: {
      title: '',
      type: 'object',
      required: ['isedDecision', 'isedDate', 'isedAnnouncement'],
      properties: {
        isedDecision: {
          type: 'string',
          enum: ['Approved', 'Not approved', 'Hold'],
        },
        isedDate: {
          type: 'string',
        },
        isedAnnouncement: {
          type: 'string',
          enum: ['Announce immediately', 'Hold announcement'],
        },
        federalRequested: {
          type: 'number',
        },
      },
    },
    letterOfApproval: {
      type: 'object',
      required: ['letterOfApprovalUpload', 'letterOfApprovalDateSent'],
      properties: {
        letterOfApprovalUpload: {
          title: ' ',
          type: 'string',
        },
        letterOfApprovalDateSent: {
          type: 'string',
        },
      },
    },
    response: {
      type: 'object',
      required: ['applicantResponse', 'statusApplicantSees'],
      properties: {
        applicantResponse: {
          type: 'string',
          enum: ['Accepted', 'Rejected'],
        },
        statusApplicantSees: {
          type: 'string',
          enum: ['Conditionally Approved'],
        },
      },
    },
  },
};

export default conditionalApproval;
