import { GeographicArea } from '../../../components/Form/CustomTitles';

const projectArea = {
  uiOrder: [
    'geographicArea',
    'projectSpanMultipleLocations',
    'provincesTerritories',
  ],
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
