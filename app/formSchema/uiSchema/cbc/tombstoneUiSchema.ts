const tombstoneUiSchema = {
  // 'ui:order': ['projectTitle', 'projectNumber', 'projectPhase'],
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Tombstone',
  projectTitle: {
    'ui:widget': 'TextWidget',
    'ui:label': 'Project Title',
  },
  originalProjectNumber: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Original Project Number',
  },
  projectNumber: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Project Number',
  },
  phase: {
    'ui:widget': 'HiddenWidget',
    'ui:placeholder': 'Select a phase',
    'ui:label': 'Phase',
  },
  intake: {
    'ui:widget': 'HiddenWidget',
    'ui:placeholder': 'Select an intake',
    'ui:label': 'Intake',
  },
  projectStatus: {
    'ui:widget': 'HiddenWidget',
    'ui:placeholder': 'Select a status',
    'ui:label': 'Status',
  },
  changeRequestPending: {
    'ui:widget': 'CheckboxWidget',
    'ui:label': 'Change Request Pending',
  },
  projectDescription: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Project Description',
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
    'ui:widget': 'TextWidget',
    'ui:label': '8.30M Funding',
  },
  federalFundingSource: {
    'ui:widget': 'TextWidget',
    'ui:label': 'Federal Funding Source',
  },
  federalProjectNumber: {
    'ui:widget': 'TextWidget',
    'ui:label': 'Federal Project Number',
  },
};

export default tombstoneUiSchema;
