const conditionalApprovalSchema = {
  conditionalApproval: {
    properties: {
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
      letterOfApprovalUpload: {
        title: ' ',
        type: 'string',
      },
      letterOfApprovalDateSent: {
        title: 'Letter of approval date sent',
      },
      applicantResponse: {
        title: 'Applicant response',
      },
      statusApplicantSees: {
        title: 'Status applicant sees',
      },
    },
  },
};

export default conditionalApprovalSchema;
