const getFormPage = (uiSchema, pageName: string) => {
  const pageNumber = uiSchema.indexOf(pageName) + 1;

  return pageNumber;
};

export default getFormPage;
