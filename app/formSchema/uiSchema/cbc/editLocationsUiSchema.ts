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
    'ui:hidden': true,
    'ui:widget': 'HiddenWidget',
  },
  regionalDistricts: {
    'ui:hidden': true,
    'ui:widget': 'HiddenWidget',
  },
  economicRegions: {
    'ui:hidden': true,
    'ui:widget': 'HiddenWidget',
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
