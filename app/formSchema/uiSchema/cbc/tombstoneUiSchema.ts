const tombstoneUiSchema = {
  // 'ui:order': ['projectTitle', 'projectNumber', 'projectPhase'],
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Tombstone',
  projectTitle: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:label': 'Project Title',
  },
  originalProjectNumber: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:label': 'Original Project Number',
  },
  projectNumber: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:label': 'Project Number',
  },
  phase: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:placeholder': 'Select a phase',
    'ui:label': 'Phase',
  },
  intake: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:placeholder': 'Select an intake',
    'ui:label': 'Intake',
  },
  projectStatus: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:placeholder': 'Select a status',
    'ui:label': 'Status',
  },
  changeRequestPending: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:label': 'Change Request Pending',
  },
  projectDescription: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Project Description',
    'ui:options': {
      maxLength: 1000,
    },
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
    'ui:label': '8.30M Funding',
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
