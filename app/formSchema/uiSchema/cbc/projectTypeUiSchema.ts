const projectTypeUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Project Type',
  projectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a project type',
    'ui:label': 'Project Type',
  },
  transportProjectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a transport project type',
    'ui:label': 'Transport Project Type',
  },
  highwayProjectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a highway project type',
    'ui:label': 'Highway Project Type',
  },
  lastMileProjectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a last mile project type',
    'ui:label': 'Last Mile Project Type',
  },
  lastMileMinimumSpeed: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a last mile minimum speed',
    'ui:label': 'Last Mile Minimum Speed',
  },
  connectedCoastNetworkDependant: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a connected coast network dependant',
    'ui:label': 'Connected Coast Network Dependant',
  },
};

export default projectTypeUiSchema;
