const projectInformationUiSchema = {
  hasFundingAgreementBeenSigned: {
    'ui:title': 'Has the funding agreement been signed?',
    'ui:widget': 'RadioWidget',
  },
  dateFundingAgreementSigned: {
    'ui:title': 'Date funding agreement signed by Province',
    'ui:widget': 'DatePickerWidget',
  },
  fundingAgreementUpload: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      allowDragAndDrop: true,
    },
  },
  statementOfWorkUpload: {
    'ui:label':
      'After pressing Import, key information will be extracted from the Statement of Work Tables to the database such as Dates, Communities & households, and Project costing & funding',
    'ui:widget': 'ExcelImportFileWidget',
    'ui:options': {
      excelImport: {
        successHeading: 'Statement of Work Data table match database',
        errorType: 'sowImportFailed',
      },
      allowDragAndDrop: true,
    },
  },
  sowWirelessUpload: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      fileTypes: '.xlsx, .xls',
      allowDragAndDrop: true,
    },
  },
  finalizedMapUpload: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      fileTypes: '.kmz, .kml',
      allowMultipleFiles: true,
      allowDragAndDrop: true,
    },
  },
  otherFiles: {
    'ui:label': 'Upload any supporting documents for the project, for example, the ISED SOW (if it differs for jointly funded projects), the Information Note for ISED-only projects, or any other relevant files.',
    'ui:widget': 'FileWidget',
    'ui:options': {
      flexDirection: 'column',
      allowMultipleFiles: true,
      allowDragAndDrop: true,
    },
  },
  sowValidationErrors: {
    'ui:widget': 'HiddenWidget',
  },
};

export default projectInformationUiSchema;
