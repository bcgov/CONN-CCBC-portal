import { EXCEL_FILE_EXTENSIONS } from '../constants';
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
    'ui:description': SupportingDocuments,
    'ui:options': {
      allowMultipleFiles: true,
      label: false,
    },
  },
  preparedFinancialStatements: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      allowMultipleFiles: true,
      label: false,
    },
  },
  logicalNetworkDiagram: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Please refer to Annex 3 of the application guide for the Logical Network Diagram requirements. Accepted file types: .pdf, .png, .jpg, .jpeg, .vsd, .vsdx, .doc, .docx, .ppt, .pptx',

    'ui:options': {
      allowMultipleFiles: true,
      label: false,
      fileTypes:
        '.pdf, .png, .jpg, .jpeg, .vsd, .vsdx, .doc, .docx, .ppt, .pptx',
    },
  },
  projectSchedule: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Please refer to Annex 3 of the application guide for the Project schedule and supporting documents requirements. Accepted file types: .xlsx or .mpp',
    'ui:options': {
      allowMultipleFiles: true,
      label: false,
      fileTypes: `${EXCEL_FILE_EXTENSIONS}, .mpp`,
    },
  },
  communityRuralDevelopmentBenefits: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Please refer to Annex 3 of the application guide for the community letters of support requirements.',
    'ui:options': {
      label: false,
      allowMultipleFiles: true,
    },
  },
  otherSupportingMaterials: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'Please upload any other files such as evidence of connectivity speeds (such as screen captures of speed test results), a written commitment to facilitating access to Passive Infrastructure, evidence of imminent access to Third Party infrastructure, evidence of other funding sources, network information and/or coverage for ISED, or other documents to support this application.',
    'ui:options': {
      label: false,
      allowMultipleFiles: true,
      hideOptional: true,
    },
  },
};

export default supportingDocuments;
