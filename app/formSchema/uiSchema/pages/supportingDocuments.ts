import { MAX_LONG_INPUT_LENGTH, EXCEL_FILE_EXTENSIONS } from '../constants';
import { SupportingDocuments } from '../../../components/Form/CustomTitles';

const supportingDocuments = {
  'ui:order': [
    'copiesOfRegistration',
    'preparedFinancialStatements',
    'logicalNetworkDiagram',
    'projectSchedule',
    'communityRuralDevelopmentBenefits',
    'otherSupportingMaterials',
  ],
  'ui:title': '',
  copiesOfRegistration: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Copies of registration and other relevant documents related to incorporation, limited partnership, joint venture, not-for-profit status, etc.',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
      // Placing this custom title here as it is the top level field in
      // supporting documents page so it will sit on top.
      customTitle: SupportingDocuments,
    },
  },
  preparedFinancialStatements: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Independently prepared financial statements for the last three (3) years',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      label: false,
      allowMultipleFiles: true,
    },
  },
  logicalNetworkDiagram: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Logical Network Diagram',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
      fileTypes:
        '.pdf, .png, .jpg, .jpeg, .vsd, .vsdx, .doc, .docx, .ppt, .pptx',
    },
  },
  projectSchedule: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Project schedule (preferably a Gantt chart)',
    'ui:options': {
      allowMultipleFiles: true,
      maxLength: MAX_LONG_INPUT_LENGTH,
      fileTypes: `${EXCEL_FILE_EXTENSIONS}, .mpp`,
    },
  },
  communityRuralDevelopmentBenefits: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Community and Rural Development Benefits supporting documents',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
    },
  },
  otherSupportingMaterials: {
    'ui:widget': 'FileWidget',
    'ui:description': 'Other supporting materials (if applicable)',
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
      allowMultipleFiles: true,
      hideOptional: true,
    },
  },
};

export default supportingDocuments;
