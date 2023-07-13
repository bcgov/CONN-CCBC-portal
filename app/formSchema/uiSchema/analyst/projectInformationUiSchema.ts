const projectInformationUiSchema = {
  hasFundingAgreementBeenSigned: {
    'ui:title': 'Has the funding agreement been signed by the province?',
    'ui:widget': 'RadioWidget',
  },
  dateFundingAgreementSigned: {
    'ui:title': 'Date funding agreement signed by Province',
    'ui:widget': 'DatePickerWidget',
  },
  fundingAgreementUpload: {
    'ui:widget': 'FileWidget',
  },
  statementOfWorkUpload: {
    'ui:title':
      'After pressing Import, key information will be extracted from the Statement of Work Tables to the database such as Dates, Communities & households, and Project costing & funding',
    'ui:widget': 'SowImportFileWidget',
  },
  sowWirelessUpload: {
    'ui:widget': 'FileWidget',
    'ui:options': {
      fileTypes: '.xlsx, .xls',
    },
  },
  finalizedMapUpload: {
    'ui:widget': 'FileWidget',
  },
};

export default projectInformationUiSchema;
