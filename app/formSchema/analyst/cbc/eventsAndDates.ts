import { RJSFSchema } from '@rjsf/utils';

const eventsAndDates: RJSFSchema = {
  title: 'Events and dates',
  description: '',
  type: 'object',
  properties: {
    nditConditionalApprovalLetterSent: {
      type: 'string',
      title: 'NDIT Conditional Approval Letter Sent',
      enum: [null, 'Yes', 'No'],
    },
    bindingAgreementSignedNditRecipient: {
      type: 'string',
      title: 'Binding Agreement Signed - NDIT Recipient',
      enum: [null, 'Yes', 'No'],
    },
    announcedByProvince: {
      type: 'string',
      title: 'Announced by Province',
      enum: [null, 'Yes', 'No'],
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
