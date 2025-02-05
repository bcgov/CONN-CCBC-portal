const changeRequestUiSchema = {
  amendmentNumber: {
    'ui:widget': 'AmendmentNumberWidget',
    'ui:title': 'Amendment #',
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
      showCharacterCount: false,
    },
    'ui:title': 'Description of change(s)',
    'ui:subtitle':
      "From the Impact Assessment Tool, not the recipient's description.",
  },
  levelOfAmendment: {
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
      showCharacterCount: false,
    },
    'ui:title': 'Additional Comments if necessary to justify amendment impact',
  },
  changeRequestFormUpload: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      flexDirection: 'column',
      allowDragAndDrop: true,
    },
  },
  statementOfWorkUpload: {
    'ui:label':
      'After pressing Import, key information will be extracted from the Statement of Work Tables to the database',
    'ui:widget': 'ExcelImportFileWidget',
    'ui:options': {
      flexDirection: 'column',
      excelImport: {
        successHeading: 'Statement of Work Data table match database',
        errorType: 'sowImportFailed',
      },
      allowDragAndDrop: true,
    },
  },
  updatedMapUpload: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      flexDirection: 'column',
      fileTypes: '.kmz, .kml',
      allowMultipleFiles: true,
      allowDragAndDrop: true,
    },
  },
  otherFiles: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      flexDirection: 'column',
      allowMultipleFiles: true,
      allowDragAndDrop: true,
    },
  },
};

export default changeRequestUiSchema;
