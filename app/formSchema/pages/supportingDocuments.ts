import { JSONSchema7 } from 'json-schema';

const supportingDocuments: Record<string, JSONSchema7> = {
  supportingDocuments: {
    title: 'Supporting documents',
    type: 'object',
    required: [
      'copiesOfRegistration',
      'preparedFinancialStatements',
      'logicalNetworkDiagram',
      'projectSchedule',
      'communityRuralDevelopmentBenefits',
    ],
    properties: {
      copiesOfRegistration: {
        title:
          'Copies of registration and other relevant documents related to incorporation, limited partnership, joint venture, not-for-profit status, etc.',
        type: 'string',
      },
      preparedFinancialStatements: {
        title:
          'Independently prepared financial statements for the last three (3) years',
        type: 'string',
      },
      logicalNetworkDiagram: {
        title: 'Logical Network Diagram',
        type: 'string',
      },
      projectSchedule: {
        title: 'Project schedule (preferably a Gantt chart)',
        type: 'string',
      },
      communityRuralDevelopmentBenefits: {
        title: 'Community and Rural Development Benefits supporting documents',
        type: 'string',
      },
      otherSupportingMaterials: {
        title: 'Other supporting materials (if applicable)',
        type: 'string',
      },
    },
  },
};

export default supportingDocuments;
