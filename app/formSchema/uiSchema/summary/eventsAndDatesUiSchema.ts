const eventsAndDatesUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Events and Dates',
  announcedByProvince: {
    'ui:widget': 'TextWidget',
    'ui:label': 'Announced by BC/ISED',
  },
  dateApplicationReceived: {
    'ui:widget': 'DateWidget',
    'ui:label': 'Date Application Received',
  },
  dateConditionallyApproved: {
    'ui:widget': 'DateWidget',
    'ui:label': 'Date Conditionally Approved',
  },
  dateAgreementSigned: {
    'ui:widget': 'DateWidget',
    'ui:label': 'Date Agreement Signed',
  },
  effectiveStartDate: {
    'ui:widget': 'DateWidget',
    'ui:label': 'Effective Start Date',
  },
  proposedStartDate: {
    'ui:widget': 'DateWidget',
    'ui:label': 'Proposed Start Date',
  },
  proposedCompletionDate: {
    'ui:widget': 'DateWidget',
    'ui:label': 'Proposed Completion Date',
  },
};

export default eventsAndDatesUiSchema;
