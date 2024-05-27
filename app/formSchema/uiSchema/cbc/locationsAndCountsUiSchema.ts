const locationsAndCountsUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Locations and Counts',
  projectLocations: {
    'ui:widget': 'TextAreaWidget',
    'ui:label': 'Project Locations',
    'ui:options': {
      maxLength: 1000,
    },
  },
  communitiesAndLocalesCount: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Communities and Locales Count',
  },
  indigenousCommunities: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Indigenous Communities',
  },
  householdCount: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Household Count',
  },
  transportKm: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Transport Km',
    'ui:options': {
      maxLength: 7,
      decimals: 2,
    },
  },
  highwayKm: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Highway Km',
    'ui:options': {
      maxLength: 7,
      decimals: 2,
    },
  },
  restAreas: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Rest Areas',
  },
};

export default locationsAndCountsUiSchema;
