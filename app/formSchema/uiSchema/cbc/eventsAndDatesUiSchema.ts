const eventsAndDatesUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Events and Dates',
  conditionalApprovalLetterSent: {
    'ui:widget': 'RadioWidget',
    'ui:label': 'Conditional Approval Letter Sent',
  },
  agreementSigned: {
    'ui:widget': 'RadioWidget',
    'ui:label': 'Agreement Signed',
  },
  announcedByProvince: {
    'ui:widget': 'RadioWidget',
    'ui:label': 'Announced By BC/ISED',
  },
  dateApplicationReceived: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Date Application Received',
  },
  dateConditionallyApproved: {
    'ui:widget': 'DatePickerWidget',
    'ui:label': 'Date Conditionally Approved',
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
