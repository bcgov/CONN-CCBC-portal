import { govBuilder } from '@button-inc/form-schema';
import schema from './formSchema/schema';
import uiSchema from './formSchema/uiSchema';

const options = {
  getRoute: '/form',
  postRoute: '/api',
  useSession: true,
  onFormEnd: (errors, formData) => {
    // (errors, formData, req) are possible parameters here
    // write function for what will happen on the form end
    console.log(`${JSON.parse(formData)} saved to database.`)
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
