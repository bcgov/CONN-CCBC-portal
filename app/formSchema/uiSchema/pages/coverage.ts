import { GeographicCoverageMap } from '../../../components/Form/CustomTitles';

const coverage = {
  'ui:order': [
    'geographicCoverageMap',
    'coverageAssessmentStatistics',
    'currentNetworkInfastructure',
    'upgradedNetworkInfrastructure',
  ],
  'ui:title': '',
  geographicCoverageMap: {
    'ui:widget': 'FileWidget',
    'ui:description': GeographicCoverageMap,
    'ui:options': {
      fileTypes: '.kmz',
      label: false,
    },
  },
  coverageAssessmentStatistics: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Please upload the XML file that was attached to the email you received upon completion of the project coverage.',
    'ui:options': {
      fileTypes: `.xml`,
      label: false,
    },
  },
  currentNetworkInfastructure: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Please include layers for your organization’s (1) fibre lines, (2) Point-of-Presence (PoPs), COs, towers and microwave links, (3) current Coverage for the proposed Project (with speeds), (4) location of Project specific Backhaul/Backbone Access Points and (5) PTP microwave paths (if applicable).',
    'ui:options': {
      label: false,
      allowMultipleFiles: true,
      fileTypes: '.kml, .kmz',
    },
  },
  upgradedNetworkInfrastructure: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Please include layers for your organization’s (1) proposed Coverage for the communities proposed in the Project, (2) locations (colour differentiated) of new and upgraded towers, Point-of-Presence (PoPs), fibre, PTP microwave links, COs and (3) new PTP microwave paths (colour differentiated) between towers (required for fixed wireless Projects).',
    'ui:options': {
      label: false,
      allowMultipleFiles: true,
      fileTypes: '.kml, .kmz',
    },
  },
};

export default coverage;
