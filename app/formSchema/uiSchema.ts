const uiSchema = {
  'ui:order': [
    'projectTitle',
    'typeOfOrganization',
    'other',
    'bandNumber',
    'organizationName',
    'isLegalPrimaryName',
    'isNameLegalName',
    'operatingName',
    'isSubsidiary',
    'parentOrgName',
    'isIndigenousEntity',
    'indigenousEntityDesc',
    'organizationOverview',
    'orgRegistrationDate',
    'bussinessNumber',
  ],
  organizationName: {},
  isLegalPrimaryName: {
    'ui:widget': 'RadioWidget',
  },
  isNameLegalName: {
    'ui:widget': 'RadioWidget',
  },
  isSubsidiary: {
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
