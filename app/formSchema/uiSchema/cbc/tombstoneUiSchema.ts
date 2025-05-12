const tombstoneUiSchema = {
  // 'ui:order': ['projectTitle', 'projectNumber', 'projectPhase'],
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Tombstone',
  originalProjectNumber: {
    'ui:widget': 'TextWidget',
    'ui:label': 'Original Project Number',
  },
  phase: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a phase',
    'ui:label': 'Phase',
  },
  intake: {
    'ui:widget': 'SelectWidget',
    'ui:shownull': false,
    'ui:label': 'Intake',
  },
  applicantContractualName: {
    'ui:widget': 'TextWidget',
    'ui:label': 'Applicant Contractual Name',
  },
  currentOperatingName: {
    'ui:widget': 'TextWidget',
    'ui:label': 'Current Operating Name',
  },
  eightThirtyMillionFunding: {
    'ui:widget': 'RadioWidget',
    'ui:label': '$830 Million Funding',
  },
  federalFundingSource: {
    'ui:widget': 'SelectWidget',
    'ui:label': 'Federal Funding Source',
  },
  federalProjectNumber: {
    'ui:widget': 'TextWidget',
    'ui:label': 'Federal Project Number',
  },
};

export default tombstoneUiSchema;
