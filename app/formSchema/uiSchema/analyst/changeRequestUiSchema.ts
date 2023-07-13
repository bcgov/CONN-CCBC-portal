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
  },
  dateRequested: {
    'ui:widget': 'DatePickerWidget',
    'ui:title': 'Date change requested/initiated',
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
  },
  levelOfAmmendment: {
    'ui:widget': 'RadioWidget',
  },
  additionalComments: {
    'ui:widget': 'TextAreaWidget',
    'ui:options': {
      boldTitle: true,
      maxLength: 10000,
    },
  },
  changeRequestFormUpload: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      fileTypes: '.xlsx, .xls',
    },
  },
  statementOfWorkUpload: {
    'ui:title':
      'After pressing Import, key information will be extracted from the Statement of Work Tables to the database such as Dates, Communities & households, and Project costing & funding',
    'ui:widget': 'SowImportFileWidget',
  },
  updatedMapUpload: {
    'ui:widget': 'FileWidget',
  },
};

export default changeRequestUiSchema;
