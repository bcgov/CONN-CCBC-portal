import { RJSFSchema } from '@rjsf/utils';

const eventsAndDates: RJSFSchema = {
  title: 'Events and Dates',
  description: '',
  type: 'object',
  required: [
    'announcedByProvince',
    'dateApplicationReceived',
    'dateConditionallyApproved',
    'dateAgreementSigned',
    'effectiveStartDate',
    'proposedStartDate',
    'proposedCompletionDate',
  ],
  properties: {
    announcedByProvince: {
      type: 'string',
      title: 'Announced by BC/ISED',
    },
    dateApplicationReceived: {
      type: 'string',
      title: 'Date Application Received',
    },
    dateConditionallyApproved: {
      type: 'string',
      title: 'Date Conditionally Approved',
    },
    dateAgreementSigned: {
      type: 'string',
      title: 'Date Agreement Signed',
    },
    effectiveStartDate: {
      type: 'string',
      title: 'Effective Start Date',
    },
    proposedStartDate: {
      type: 'string',
      title: 'Proposed Start Date',
    },
    proposedCompletionDate: {
      type: 'string',
      title: 'Proposed Completion Date',
    },
  },
};

export default eventsAndDates;
