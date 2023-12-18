import {
  GeographicArea,
  GeographicAreaNotice,
} from '../../../components/Form/CustomTitles';

const projectArea = {
  'ui:order': [
    'acceptedGeographicArea',
    'geographicArea',
    'projectZoneMap',
    'projectSpanMultipleLocations',
    'provincesTerritories',
  ],
  'ui:title': '',
  'ui:description': GeographicAreaNotice,
  acceptedGeographicArea: {
    'ui:widget': 'ReadOnlyProjectAreaWidget',
    'ui:options': {
      label: false,
    },
  },
  geographicArea: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      maxLength: 150,
      singleSelection: true,
      customTitle: true,
      kmzLink: true,
    },
  },
  projectZoneMap: {
    'ui:widget': 'ZoneMapWidget',
    'ui:options': {
      customTitle: true,
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
      columns: 15,
      title: GeographicArea,
      geographicArea: '1 / 3',
      projectZoneMap: '3 / 13',
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
