const assessmentsUiSchema = {
  'ui:order': [
    'ministerDecision',
    'ministerDate',
    'ministerAnnouncement',
    'isedDecision',
    'isedDate',
    'isedAnnouncement',
    'decision',
    'letterOfApproval',
    'response',
  ],
  'ui:field': 'SectionField',
  ministerDecision: {
    'ui:options': {
      label: false,
    },
  },
};

export default assessmentsUiSchema;
