const projectTypeUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  projectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a project type',
  },
  transportProjectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a transport project type',
  },
  highwayProjectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a highway project type',
  },
  lastMileProjectType: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a last mile project type',
  },
  lastMileMinimumSpeed: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a last mile minimum speed',
  },
  connectedCoastNetworkDependant: {
    'ui:widget': 'SelectWidget',
    'ui:placeholder': 'Select a connected coast network dependant',
  },
};

export default projectTypeUiSchema;
