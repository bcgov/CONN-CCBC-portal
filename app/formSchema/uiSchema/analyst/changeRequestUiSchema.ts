const changeRequestUiSchema = {
  'ui:order': [
    'ammendmentNumber',
    'dateRequested',
    'dateApproved',
    'descriptionOfChanges',
    'levelOfAmmendment',
    'additionalComments',
    'changeRequestFormUpload',
    'statementOfWorkUpload',
    'updatedMapUpload',
  ],
  ammendmentNumber: {
    'ui:widget': 'NumberWidget',
    'ui:title': 'Ammendment #',
    'ui:option': {
      flexAlign: 'baseline',
    },
  },
  dateRequested: {
    'ui:widget': 'DatePickerWidget',
    'ui:title': 'Date change requested/  initiated',
    'ui:options': {
      maxDate: new Date(),
    },
  },
  dateApproved: {
    'ui:widget': 'DatePickerWidget',
    'ui:options': {
      maxDate: Date.now(),
    },
    'ui:title': 'Date Approved',
  },
  descriptionOfChanges: {
    'ui:widget': 'TextAreaWidget',
    'ui:options': {
      boldTitle: true,
      maxLength: 10000,
    },
    'ui:title': 'Description of change(s)',
    'ui:subtitle':
      "From the Impact Assessment Tool, not the recipient's description.",
  },
  levelOfAmmendment: {
    'ui:widget': 'RadioWidget',
    'ui:title': 'Level of amendment',
    'ui:option': {
      flexAlign: 'baseline',
    },
  },
  additionalComments: {
    'ui:widget': 'TextAreaWidget',
    'ui:options': {
      boldTitle: true,
      maxLength: 10000,
    },
    'ui:title': 'Additional Comments if necessary to justify amendment impact',
  },
  changeRequestFormUpload: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      flexDirection: 'column',
    },
  },
  statementOfWorkUpload: {
    'ui:title':
      'After pressing Import, key information will be extracted from the Statement of Work Tables to the database such as Dates, Communities & households, and Project costing & funding',
    'ui:widget': 'SowImportFileWidget',
    'ui:options': {
      flexDirection: 'column',
    },
  },
  updatedMapUpload: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      flexDirection: 'column',
    },
  },
};

export default changeRequestUiSchema;
