const projectInformationUiSchema = {
  hasFundingAgreementBeenSigned: {
    'ui:title': 'Has the funding agreement been signed by the province?',
    'ui:widget': 'RadioWidget',
  },
  main: {
    dateFundingAgreementSigned: {
      'ui:title': 'Date funding agreement signed by the province',
      'ui:widget': 'DatePickerWidget',
    },
    upload: {
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
      },
      finalizedMapUpload: {
        'ui:widget': 'FileWidget',
      },
    },
  },
};

export default projectInformationUiSchema;
