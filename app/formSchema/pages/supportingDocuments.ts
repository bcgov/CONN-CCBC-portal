const supportingDocuments = {
  supportingDocuments: {
    title: 'Supporting documents',
    type: 'object',
    description:
      'Please upload additional attachments. Please avoid using special characters in the file name. The maximum size per file is 100MB',
    required: [
      'projectTitle',
      'geographicAreaDescription',
      'projectDescription',
    ],
    properties: {
      copiesOfRegistration: {
        title:
          'Copies of registration and other relevant documents related to incorporation, limited partnership, joint venture, not-for-profit status, etc. ',
        type: 'string',
      },
      preparedFinancialStatements: {
        title:
          'Independently prepared financial statements for the last three (3) years',
        type: 'string',
      },
    },
  },
};

export default supportingDocuments;
