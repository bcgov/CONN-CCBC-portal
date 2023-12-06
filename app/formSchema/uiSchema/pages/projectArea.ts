import { GeographicArea } from '../../../components/Form/CustomTitles';

const projectArea = {
  'ui:order': [
    'geographicArea',
    'projectZoneMap',
    'projectSpanMultipleLocations',
    'provincesTerritories',
  ],
  'ui:title': '',
  geographicArea: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      maxLength: 150,
      singleSelection: true,
      customTitle: true,
    },
  },
  projectZoneMap: {
    'ui:widget': 'ZoneMapWidget',
    'ui:options': {
      customTitle: true
    },
  },
  projectSpanMultipleLocations: {
    'ui:widget': 'RadioWidget',
  },
  provincesTerritories: {
    'ui:widget': 'CheckboxesWidget',
  },
  'ui:inline': [
    {
      columns: 7,
      title: GeographicArea,
      geographicArea: '1 / 2',
      projectZoneMap: '2 / 8',
    },
  ],
  'ui:inline:sm': [
    {
      columns: 1,
      title: GeographicArea,
      geographicArea: '1 / 2',
      projectZoneMap: '1 / 2',
    },
  ],
};

export default projectArea;
