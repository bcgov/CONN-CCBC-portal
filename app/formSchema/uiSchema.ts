const uiSchema = {
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
  orgRegistrationDate: {
    'ui:widget': 'DatePickerWidget',
  },
  bussinessNumber: {},
  isMailingAddress: {
    'ui:widget': 'RadioWidget',
  },
};

export default uiSchema;
