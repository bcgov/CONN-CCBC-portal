const locationsUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  zones: {
    'ui:widget': 'CheckboxesWidget',
    'ui:label': 'Project Zone',
    'ui:hidetitleineditmode': true,
    'ui:options': {
      checkboxDirection: 'column',
    },
  },
  projectLocations: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Project Locations',
    'ui:hidetitleineditmode': true,
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
    'ui:label': 'Community Location Data',
    items: {
      'ui:widget': 'CommunitySourceWidget',
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
