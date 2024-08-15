const locationsUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },

  communitySourceData: {
    items: {
      communitySources: {
        'ui:widget': 'CommunitySourceObjectWidget',
        'ui:label': 'Community Sources',
      },
    },
  },

  projectLocations: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Project Locations',
  },
};

export default locationsUiSchema;
