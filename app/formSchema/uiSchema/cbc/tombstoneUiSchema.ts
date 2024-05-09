const tombstoneUiSchema = {
  // 'ui:order': ['projectTitle', 'projectNumber', 'projectPhase'],
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  projectTitle: {
    'ui:widget': 'TextAreaWidget',
  },
  projectNumber: {
    'ui:widget': 'TextAreaWidget',
  },
  phase: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a phase',
  },
  intake: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select an intake',
  },
  projectStatus: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a status',
  },
  changeRequestPending: {
    'ui:widget': 'CheckboxWidget',
  },
  projectDescription: {
    'ui:widget': 'TextAreaWidget',
  },
  applicantContractualName: {
    'ui:widget': 'TextAreaWidget',
  },
  currentOperatingName: {
    'ui:widget': 'TextAreaWidget',
  },
  eightThirtyMillionFunding: {
    'ui:widget': 'TextAreaWidget',
  },
  federalFundingSource: {
    'ui:widget': 'TextAreaWidget',
  },
  federalProjectNumber: {
    'ui:widget': 'TextAreaWidget',
  },
};

export default tombstoneUiSchema;
