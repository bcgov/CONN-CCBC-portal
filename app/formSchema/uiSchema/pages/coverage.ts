import { EXCEL_FILE_EXTENSIONS, MAX_LONG_INPUT_LENGTH } from '../constants';
import { GeographicCoverageMap } from '../../../components/Form/CustomTitles';

const coverage = {
  geographicCoverageMap: {
    'ui:widget': 'FileWidget',
    'ui:description': `Geographic coverage map from ISED's Eligibility Mapping Tool. KMZ is required.`,
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      fileTypes: '.kmz',
      label: false,
      customTitle: GeographicCoverageMap,
    },
  },
  coverageAssessmentStatistics: {
    'ui:widget': 'FileWidget',
    'ui:description': `ISED's Eligibility Mapping Tool - Coverage Assessment and Statistics`,
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      fileTypes: `.eml, .msg, .txt, .pdf, .doc, .docx, .xml, .jpg, .jpeg, .png, ${EXCEL_FILE_EXTENSIONS}`,
    },
  },
  currentNetworkInfastructure: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Current network infrastructure in a geo-coded format',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
      fileTypes: '.kml, .kmz',
    },
  },
  upgradedNetworkInfrastructure: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Proposed or Upgraded Network Infrastructure (project-specific) in a geo-coded format',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
      fileTypes: '.kml, .kmz',
    },
  },
};

export default coverage;
