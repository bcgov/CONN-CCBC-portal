const eventsAndDatesUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Events and Dates',
  nditConditionalApprovalLetterSent: {
    'ui:widget': 'RadioWidget',
    'ui:label': 'NDIT Conditional Approval Letter Sent',
  },
  bindingAgreementSignedNditRecipient: {
    'ui:widget': 'RadioWidget',
    'ui:label': 'Binding Agreement Signed NDIT Recipient',
  },
  announcedByProvince: {
    'ui:widget': 'RadioWidget',
    'ui:label': 'Announced By Province',
  },
  dateApplicationReceived: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Date Application Received',
  },
  dateConditionallyApproved: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Date Conditionally Approved Approved',
  },
  dateAgreementSigned: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Date Agreement Signed',
  },
  proposedStartDate: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Proposed Start Date',
  },
  proposedCompletionDate: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Proposed Completion Date',
  },
  reportingCompletionDate: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Reporting Completion Date',
  },
  dateAnnounced: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Date Announced',
  },
};

export default eventsAndDatesUiSchema;
