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
};

export default analystProjectArea;
