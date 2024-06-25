const tombstoneUiSchema = {
  // 'ui:order': ['projectTitle', 'projectNumber', 'projectPhase'],
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Tombstone',
  originalProjectNumber: {
    'ui:widget': 'ReadOnlyWidget',
    'ui:label': 'Original Project Number',
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
