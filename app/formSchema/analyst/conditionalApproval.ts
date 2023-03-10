import { JSONSchema7 } from 'json-schema';

const conditionalApproval: JSONSchema7 = {
  title: 'Conditional approval',
  description: '',
  type: 'object',
  properties: {
    decision: {
      title: `Minister's decision`,
      type: 'object',
      required: [
        'ministerDecision',
        'ministerDate',
        'ministerAnnouncement',
        'isedDecision',
        'isedDate',
        'isedAnnouncement',
      ],

      properties: {
        ministerDecision: {
          title: ' ',
          type: 'string',
        },
        ministerDate: {
          title: ' ',
          type: 'string',
        },
        ministerAnnouncement: {
          title: ' ',
          type: 'string',
        },
        isedDecision: {
          title: ' ',
          type: 'string',
        },
        isedDate: {
          title: ' ',
          type: 'string',
        },
        isedAnnouncement: {
          title: 'Project description',
          type: 'string',
        },
      },
    },
    letterOfApproval: {
      title: 'Letter of conditional approval',
      type: 'object',
      properties: {
        letterOfApprovalUpload: {
          title: '',
          type: 'string',
        },
        letterOfApprovalDateSent: {
          title: '',
          type: 'string',
        },
      },
    },
    response: {
      title: 'Letter of conditional approval',
      type: 'object',
      properties: {
        applicantResponse: {
          title: '',
          type: 'string',
        },
        statusApplicantSees: {
          title: '',
          type: 'string',
        },
      },
    },
  },
};

export default conditionalApproval;
