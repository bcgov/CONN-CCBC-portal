import {
  GeographicArea,
  GeographicAreaNotice,
} from '../../../components/Form/CustomTitles';

const projectArea = {
  'ui:order': [
    'acceptedGeographicArea',
    'firstNationsLed',
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
  firstNationsLed: {
    'ui:widget': 'RadioWidget',
  },
  geographicArea: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      maxLength: 150,
      singleSelection: true,
      customTitle: GeographicArea,
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
      columns: 1,
      acceptedGeographicArea: 1,
    },
    {
      columns: 2,
      firstNationsLed: '1 / 2',
      geographicArea: '1 / 2',
      projectZoneMap: '2 / 3',
      // only if you need to manupulate row spans within a grid row
      rowspans: {
        firstNationsLed: '1 / 2',
        geographicArea: '2 / 3',
        projectZoneMap: '1 / 3',
      },
    },
  ],
  'ui:inline:sm': [
    {
      columns: 1,
      firstNationsLed: '1 / 2',
      geographicArea: '1 / 2',
      projectZoneMap: '1 / 2',
    },
  ],
};

export default projectArea;
