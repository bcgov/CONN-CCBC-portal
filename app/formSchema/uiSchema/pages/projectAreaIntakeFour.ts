import projectArea from './projectArea';

const projectAreaIntakeFour = {
  ...projectArea,
  acceptedGeographicArea: {
    'ui:widget': 'ReadOnlyProjectAreaWidgetIntakeFour',
    'ui:options': {
      label: false,
    },
  },
};

export default projectAreaIntakeFour;
