const locationsUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Locations',
  benefitingIndigenousCommunities: {
    'ui:widget': 'LinkArrayWidget',
    'ui:label': 'List of Indigenous communities benefitting',
  },
  benefitingCommunities: {
    'ui:widget': 'LinkArrayWidget',
    'ui:label': 'List of Non-Indigenous communities benefitting',
  },
  economicRegions: {
    'ui:widget': 'TextWidget',
    'ui:label': 'List of Economic Regions',
  },
  regionalDistricts: {
    'ui:widget': 'TextWidget',
    'ui:label': 'List of Regional Districts',
  },
};
export default locationsUiSchema;
