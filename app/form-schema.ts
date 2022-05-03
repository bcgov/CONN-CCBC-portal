import { govBuilder } from '@button-inc/form-schema';
import schema from './formSchema/schema';
import uiSchema from './formSchema/uiSchema';

const options = {
  getRoute: '/form',
  postRoute: '/api',
  useSession: false,
  onFormEnd: (errors: Error[], formData: object) => {
    // (errors, formData, req) are possible parameters here
    // write function for what will happen on the form end
    console.log(`onFormEnd: ${formData} saved to database.`);
  },
  onPost: (formData: object) => {
    // (formData, schemaIndex, cleanSchemaData, req) are possible parameters here
    // function that will fire on each page change
    console.log(`onPost: ${formData} saved to database.`);
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
