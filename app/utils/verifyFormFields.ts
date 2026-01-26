import readAllKeys from './readAllKeys';

const verifyFormFields = (formSectionData, schemaSection, handleError) => {
  // verify that the form fields are in the seciton of the schema we are saving
  // to prevent the bug where fields were being saved in the wrong section
  //
  // formSectionData: the data from the form we are verifying. For the applicant form this is the data from each separate page eg: 'formData.otherFundingSources'
  // schemaSection: the section of the schema we verifying against. For the applicant form this is under 'schema.properties[sectionName].properties'
  // handleError: the function to call if there is an error. In the applicant form we use it to report the issue.

  // read all new form data fields from incoming form data
  const newFormFieldNames = formSectionData && Object.keys(formSectionData);

  // read all keys from the schema section
  const formSchemaSectionFieldNames = readAllKeys(schemaSection);

  // find any form fields that should be in this section of the form
  const incorrectFormFields = newFormFieldNames?.filter(
    (fieldName) => !formSchemaSectionFieldNames.includes(fieldName)
  );

  if (incorrectFormFields.length > 0 && handleError) {
    handleError(incorrectFormFields?.join(', '));
  }

  // remove incorrect form fields from the form data
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
