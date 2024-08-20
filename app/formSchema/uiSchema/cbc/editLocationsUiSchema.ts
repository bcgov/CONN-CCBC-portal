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
    'ui:widget': 'hidden',
  },
  regionalDistricts: {
    'ui:widget': 'hidden',
  },
  economicRegions: {
    'ui:widget': 'hidden',
  },
  communitySourceData: {
    'ui:field': 'ArrayLocationDataField',
    items: {
      'ui:widget': 'CommunitySourceWidget',
      'ui:label': 'Community Sources',
      'ui:options': {
        excludeTableFormat: true,
      },
    },
    'ui:options': {
      excludeTableFormat: true,
    },
  },
};

export default locationsUiSchema;
