const projectTypeUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Project Type',
  projectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Project type',
    'ui:label': 'Project Type',
  },
  transportProjectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Transport type',
    'ui:label': 'Transport Project Type',
  },
  highwayProjectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Highway project type',
  },
  lastMileProjectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Last mile type',
    'ui:label': 'Last Mile Project Type',
  },
  lastMileMinimumSpeed: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Last mile minimum speed',
    'ui:label': 'Last Mile Minimum Speed',
  },
  connectedCoastNetworkDependant: {
    'ui:widget': 'RadioWidget',
    'ui:label': 'Connected Coast Network Dependant',
  },
};

export default projectTypeUiSchema;
