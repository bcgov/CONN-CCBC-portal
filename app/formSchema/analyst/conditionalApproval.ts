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
          title: ' ',
          type: 'string',
          enum: ['Approved', 'Not approved', 'Hold'],
        },
        ministerDate: {
          title: ' ',
          type: 'string',
        },
        ministerAnnouncement: {
          title: ' ',
          type: 'string',
          enum: ['Announce immediately', 'Hold announcement'],
        },
      },
    },
    isedDecision: {
      title: ' ',
      type: 'object',
      required: ['isedDecision', 'isedDate', 'isedAnnouncement'],
      properties: {
        isedDecision: {
          title: ' ',
          type: 'string',
          enum: ['Approved', 'Not approved', 'Hold'],
        },
        isedDate: {
          title: ' ',
          type: 'string',
        },
        isedAnnouncement: {
          title: ' ',
          type: 'string',
          enum: ['Announce immediately', 'Hold announcement'],
        },
      },
    },
    letterOfApproval: {
      title: 'Letter of conditional approval',
      type: 'object',
      required: ['letterOfApprovalUpload', 'letterOfApprovalDateSent'],
      properties: {
        letterOfApprovalUpload: {
          title: ' ',
          type: 'string',
        },
        letterOfApprovalDateSent: {
          title: ' ',
          type: 'string',
        },
      },
    },
    response: {
      title: 'Letter of conditional approval',
      type: 'object',
      required: ['applicantResponse', 'statusApplicantSees'],
      properties: {
        applicantResponse: {
          title: ' ',
          type: 'string',
          enum: ['Accepted', 'Rejected'],
        },
        statusApplicantSees: {
          title: ' ',
          type: 'string',
          enum: ['Conditionally Approved'],
        },
      },
    },
  },
};

export default conditionalApproval;
