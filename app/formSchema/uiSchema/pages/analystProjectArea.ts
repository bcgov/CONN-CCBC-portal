import { GeographicArea } from 'components/Form/CustomTitles';
import projectArea from './projectArea';

const analystProjectArea = {
  ...projectArea,
  geographicArea: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      maxLength: 150,
      customTitle: GeographicArea,
      singleSelection: false,
    },
  },
  projectZoneMap: {
    'ui:widget': 'HiddenWidget',
    'ui:options': {
      customTitle: true,
    },
  },
};

export default analystProjectArea;
