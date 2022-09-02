import { GeographicArea } from '../../../components/Form/CustomTitles';

const projectArea = {
  geographicArea: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      maxLength: 150,
      customTitle: GeographicArea,
    },
  },
  projectSpanMultipleLocations: {
    'ui:widget': 'RadioWidget',
  },
  provincesTerritories: {
    'ui:widget': 'CheckboxesWidget',
  },
};

export default projectArea;
