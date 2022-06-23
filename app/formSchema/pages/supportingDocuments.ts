const supportingDocuments = {
  supportingDocuments: {
    title: 'Supporting documents',
    type: 'object',
    description:
      'Please upload additional attachments. Please avoid using special characters in the file name. The maximum size per file is 100MB',
    properties: {
      copiesOfRegistration: {
        type: 'string',
      },
      preparedFinancialStatements: {
        type: 'string',
      },
      logicalNetworkDiagram: {
        title:
          'Please refer to Annex 3 of the application guide for the logical network diagram requirements',
        type: 'string',
      },
      projectSchedule: {
        title:
          'Please refer to Annex 3 of the application guide for the project schedule and supporting documents requirements',
        type: 'string',
      },
      communityRuralDevelopmentBenefits: {
        title:
          'Please refer to Annex 3 of the application guide for the community letters of support requirements',
        type: 'string',
      },
    },
  },
};

export default supportingDocuments;
