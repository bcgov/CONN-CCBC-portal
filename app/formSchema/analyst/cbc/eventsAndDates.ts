import { RJSFSchema } from '@rjsf/utils';

const eventsAndDates: RJSFSchema = {
  title: 'Events and dates',
  description: '',
  type: 'object',
  properties: {
    conditionalApprovalLetterSent: {
      type: 'boolean',
      title: 'Conditional Approval Letter Sent',
      oneOf: [
        { const: true, title: 'Yes' },
        { const: false, title: 'No' },
      ],
    },
    agreementSigned: {
      type: 'boolean',
      title: 'Agreement Signed',
      oneOf: [
        { const: true, title: 'Yes' },
        { const: false, title: 'No' },
      ],
    },
    announcedByProvince: {
      type: 'boolean',
      title: 'Announced by BC/ISED',
      oneOf: [
        { const: true, title: 'Yes' },
        { const: false, title: 'No' },
      ],
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
    proposedStartDate: {
      type: 'string',
      title: 'Proposed Start Date',
    },
    proposedCompletionDate: {
      type: 'string',
      title: 'Proposed Completion Date',
    },
    reportingCompletionDate: {
      type: 'string',
      title: 'Reporting Completion Date',
    },
    dateAnnounced: {
      type: 'string',
      title: 'Date Announced',
    },
  },
};

export default eventsAndDates;
