const uiSchema = {
  isLegalPrimaryName: {
    'ui:widget': 'RadioWidget',
  },
  isOperatingNameSame: {
    'ui:widget': 'RadioWidget',
  },
  typeOfOrganization: {
    'ui:widget': 'checkboxes',
  },
  isIndigenousEntity: {
    'ui:widget': 'RadioWidget',
  },
  organizationOverview: {
    'ui:widget': 'TextAreaWidget',
  },
  isMailingAddress: {
    'ui:widget': 'RadioWidget',
  },
  isAuthContactSigningOfficer: {
    'ui:widget': 'RadioWidget',
  },
  isAltContactSigningOfficer: {
    'ui:widget': 'RadioWidget',
  },
  hasProvidedExitingNetworkCoverage: {
    'ui:widget': 'checkboxes',
  },
  hasPassiveInfrastructure: {
    'ui:widget': 'RadioWidget',
  },
  isInfrastuctureAvailable: {
    'ui:widget': 'RadioWidget',
  },
  requiresThirdPartyInfrastructureAccess: {
    'ui:widget': 'RadioWidget',
  },
  projectSpanMultipleLocations: {
    'ui:widget': 'RadioWidget',
  },
  projectLocations: {
    'ui:widget': 'checkboxes',
  },
  projectDescription: {
    'ui:widget': 'TextAreaWidget',
  },
};

export default uiSchema;
