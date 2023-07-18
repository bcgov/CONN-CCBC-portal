import { JSONSchema7 } from 'json-schema';

const changeRequest: JSONSchema7 = {
  description: '',
  type: 'object',
  properties: {
    amendmentNumber: {
      title: 'Amendment #',
      type: 'integer',
      maximum: 999,
    },
    dateRequested: {
      title: 'Date change requested/initiated',
      type: 'string',
    },
    dateApproved: {
      title: 'Date Approved',
      type: 'string',
    },
    descriptionOfChanges: {
      title: 'Description of change(s)',
      type: 'string',
    },
    levelOfAmendment: {
      title: 'Level of amendment',
      type: 'string',
      enum: ['Major Amendment', 'Minor Amendment', 'Super Minor Amendment'],
    },
    additionalComments: {
      title: 'Additional Comments if necessary to justify amendment impact',
      type: 'string',
    },
    changeRequestFormUpload: {
      title:
        'Upload the completed Project Change Request form (including the completed Impact Assessment Tool tab)',
      type: 'string',
    },
    statementOfWorkUpload: {
      title: 'Upload the completed statement of work Excel file',
      type: 'string',
    },
    updatedMapUpload: {
      title: 'Upload the updated map',
      type: 'string',
    },
  },
};

export default changeRequest;
