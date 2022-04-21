import { govBuilder } from '@button-inc/form-schema';
import schema from './formSchema/orgSchema';
import uiSchema from './formSchema/uiSchema';

const options = {
  getRoute: '/form/organization',
  postRoute: '/api',
  useSession: false,
  onFormEnd: () => {
    // (errors, formData, req) are possible parameters here
    // write function for what will happen on the form end
  },
  onPost: () => {
    // (formData, schemaIndex, cleanSchemaData, req) are possible parameters here
    // function that will fire on each page change
  },
  validateEachPage: true,
  validatedUrl: '/review',
  invalidUrl: '/error',
};

export const { postMiddleware, getHandler, Forms } = govBuilder(
  schema,
  uiSchema,
  options
);
