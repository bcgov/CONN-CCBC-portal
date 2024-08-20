const locationsUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  projectLocations: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Project Locations',
  },
  geographicNames: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Geographic Names',
  },
  regionalDistricts: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Regional Districts',
  },
  economicRegions: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Economic Regions',
  },
  communitySourceData: {
    'ui:hidden': true,
  },
};

export default locationsUiSchema;
