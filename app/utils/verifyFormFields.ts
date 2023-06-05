const verifyFormFields = (formSectionData, formSectionName, formSchema) => {
  // verify that the form fields are in the seciton of the schema we are saving
  // to prevent the bug where fields were being saved in the wrong section
  const newFormFieldNames = formSectionData && Object.keys(formSectionData);
  const formSchemaSectionFieldNames = Object.keys(
    formSchema.properties[formSectionName]['properties']
  );
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
