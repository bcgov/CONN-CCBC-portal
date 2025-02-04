import { RJSFSchema } from '@rjsf/utils';

const changeRequest: RJSFSchema = {
  description: '',
  type: 'object',
  required: ['amendmentNumber'],
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
      anyOf: [
        {
          title: 'Major Amendment',
          enum: ['Major Amendment'],
        },
        {
          title: 'Minor Amendment',
          enum: ['Minor Amendment'],
        },
        {
          title: 'Super Minor Amendment',
          enum: ['Super Minor Amendment'],
        },
      ],
    },
    additionalComments: {
      title: 'Additional Comments if necessary to justify amendment impact',
      type: 'string',
    },
    changeRequestFormUpload: {
      title:
        'Upload the completed Project Change Request form (including the completed Impact Assessment Tool tab) (if available, can be added at another time)',
      type: 'string',
    },
    statementOfWorkUpload: {
      title:
        'Upload the completed statement of work Excel file (if available, can be added at another time)',
      type: 'string',
    },
    updatedMapUpload: {
      title: 'Upload updated spatial data (KMZ or KML)',
      type: 'string',
    },
    otherFiles: {
      title: 'Other files',
      type: 'string',
    },
  },
};

export default changeRequest;
