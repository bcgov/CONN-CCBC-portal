import uiSchema from 'formSchema/uiSchema/uiSchema';

const getFormPage = (pageName: string) => {
  const pageNumber = uiSchema['ui:order'].indexOf(pageName) + 1;

  return pageNumber;
};

export default getFormPage;
