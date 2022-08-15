const supportingDocuments = (isEvidenceOfConnectivityRequired) => {
  // This page is a function because evidenceOfConnectivitySpeeds is required depending on if an upload
  // field from another page was filled. So we check the form data in schema.ts and pass it here if it is filled.

  return {
    supportingDocuments: {
      title: 'Supporting documents',
      type: 'object',
      description:
        'Please upload additional attachments. Please avoid using special characters in the file name. The maximum size per file is 100MB',
      required: [
        'copiesOfRegistration',
        'preparedFinancialStatements',
        'logicalNetworkDiagram',
        'projectSchedule',
        'communityRuralDevelopmentBenefits',
        isEvidenceOfConnectivityRequired ? 'evidenceOfConnectivitySpeeds' : '',
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
          title:
            'Please refer to Annex 3 of the application guide for the Logical Network Diagram requirements',
          type: 'string',
        },
        projectSchedule: {
          title:
            'Please refer to Annex 3 of the application guide for the Project schedule and supporting documents requirements',
          type: 'string',
        },
        communityRuralDevelopmentBenefits: {
          title:
            'Please refer to Annex 3 of the application guide for the community letters of support requirements. If you do not currently have these, you will have a 30-day grace period after the intake closes to submit them.',
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
};

export default supportingDocuments;
