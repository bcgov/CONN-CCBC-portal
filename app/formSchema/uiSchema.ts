const uiSchema = {
  organizationProfile: {
    organizationName: {},
    isLegalPrimaryName: {
      'ui:widget': 'RadioWidget',
    },
    isOperatingNameSame: {
      'ui:widget': 'RadioWidget',
    },
    operatingNameIfDifferent: {},
    typeOfOrganization: {
      'ui:widget': 'RadioWidget',
    },
    bandCouncilNumber: {},
    isIndigenousEntity: {
      'ui:widget': 'RadioWidget',
    },
    indigenousEntityDesc: {},
    organizationOverview: {
      'ui:widget': 'TextAreaWidget',
    },
    orgRegistrationDate: {},
    bussinessNumber: {},
  },
};

export default uiSchema;
