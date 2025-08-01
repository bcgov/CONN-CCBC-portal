const locationsUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  zones: {
    'ui:field': 'InlineArrayField',
    'ui:label': 'Project Zone',
    'ui:options': {
      sort: true,
    },
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
