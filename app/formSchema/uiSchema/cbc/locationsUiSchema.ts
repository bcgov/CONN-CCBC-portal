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
    type: 'string',
    title: 'Geographic Names',
  },
  regionalDistricts: {
    type: 'string',
    title: 'Regional Districts',
  },
  economicRegions: {
    type: 'string',
    title: 'Economic Regions',
  },
};

export default locationsUiSchema;
