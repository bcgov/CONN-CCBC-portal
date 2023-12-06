import projectArea from './projectArea';

const analystProjectArea = {
  ...projectArea,
  geographicArea: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      maxLength: 150,
      customTitle: true,
      singleSelection: false,
    },
  },
  projectAreaMap: {
    'ui:widget': 'HiddenWidget',
    'ui:options': {
      customTitle: true,
    },
  },
};

export default analystProjectArea;
