const decisionFields = {
  ministerDecision: {
    title: 'Minister decision',
  },
  ministerDate: {
    title: 'Minister decision date',
  },
  ministerAnnouncement: {
    title: 'Minister announcement',
  },
  provincialRequested: {
    type: 'number',
    title: 'Provincial requested',
  },
};

const isedDecisionFields = {
  isedDecision: {
    title: 'ISED decision',
  },
  isedDate: {
    title: 'ISED decision date',
  },
  isedAnnouncement: {
    title: 'ISED announcement',
  },
  federalRequested: {
    type: 'number',
    title: 'Federal requested',
  },
};

const responseFields = {
  applicantResponse: {
    title: 'Applicant response',
  },
  statusApplicantSees: {
    title: 'Status applicant sees',
  },
};

const conditionalApprovalSchema = {
  conditionalApproval: {
    properties: {
      ...decisionFields,
      ...isedDecisionFields,
      ...responseFields,
      letterOfApprovalUpload: {
        title: ' ',
        type: 'string',
      },
      letterOfApprovalDateSent: {
        title: 'Letter of approval date sent',
      },
      response: {
        type: 'object',
        properties: {
          ...responseFields,
        },
      },
      decision: {
        type: 'object',
        properties: {
          ...decisionFields,
        },
      },
      isedDecisionObj: {
        type: 'object',
        properties: {
          ...isedDecisionFields,
        },
      },
    },
  },
};

export default conditionalApprovalSchema;
