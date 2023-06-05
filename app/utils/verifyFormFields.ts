const verifyFormFields = (formSectionData, schemaSection) => {
  // verify that the form fields are in the seciton of the schema we are saving
  // to prevent the bug where fields were being saved in the wrong section
  //
  // formSectionData: the data from the form we are verifying. For the applicant form this is the data from each separate page eg: 'formData.otherFundingSources'
  // schemaSection: the section of the schema we verifying against. For the applicant form this is under 'schema.properties[sectionName].properties'

  const newFormFieldNames = formSectionData && Object.keys(formSectionData);
  const formSchemaSectionFieldNames = Object.keys(schemaSection);
  const incorrectFormFields = newFormFieldNames?.filter(
    (fieldName) => !formSchemaSectionFieldNames.includes(fieldName)
  );
  const verifiedFormSectionData =
    formSectionData &&
    Object.fromEntries(
      Object.entries(formSectionData).filter(
        ([key]) => !incorrectFormFields.includes(key)
      )
    );

  return verifiedFormSectionData;
};

export default verifyFormFields;
