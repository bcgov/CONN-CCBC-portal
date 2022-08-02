const supportingDocuments = {
  supportingDocuments: {
    title: 'Supporting documents',
    type: 'object',
    description:
<<<<<<< HEAD
      'Please upload additional attachments. Please do not include special characters in the file name. The maximum size per file is 100MB.',
    required: ['communityRuralDevelopmentBenefits'],
=======
      'Please upload additional attachments. Please avoid using special characters in the file name. The maximum size per file is 100MB',
    required: [
      'copiesOfRegistration',
      'preparedFinancialStatements',
      'communityRuralDevelopmentBenefits',
    ],
>>>>>>> 7aeb0bd (feat: add basic upload validations)
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
        title:
          'Please refer to Annex 3 of the application guide for the Logical Network Diagram requirements',
        type: 'string',
      },
      projectSchedule: {
        title:
          'Project schedule (preferably a Gantt chart). Please refer to Annex 3 of the application guide for the Project schedule requirements.',
        type: 'string',
      },
      communityRuralDevelopmentBenefits: {
        title:
          'Please refer to Annex 3 of the application guide for the community letters of support requirements',
        type: 'string',
      },
      evidenceOfConnectivitySpeeds: {
        title:
          'If you submitted Template 8: Supporting Connectivity Evidence, please upload evidence documents here.',
        type: 'string',
      },
    },
  },
};

export default supportingDocuments;
