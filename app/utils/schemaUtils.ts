import { RJSFSchema } from '@rjsf/utils';
/**
 * @param schema A valid JSON schema
 * @returns an array of the the schema properties with the following structure:
 * [ [<section title>, <section schema>] ]
 */
export const schemaToSubschemasArray = (
  schema: RJSFSchema
): [string, unknown][] => {
  return Object.entries(schema.properties as any);
};

/**
 *
 * @param schema Any json schema
 * @param uiSchema The uiSchema that could apply to the schema, can contain more fields than the schema
 */
export const getFilteredSchemaOrderFromUiSchema = (
  schema: any,
  uiSchema: any
) => {
  return uiSchema['ui:order'].filter((formName) => {
    return Object.hasOwn(schema.properties, formName);
  });
};

export const getSectionNameFromPageNumber = (
  uiSchema,
  pageNumber: number
): keyof typeof uiSchema => {
  return uiSchema['ui:order'][pageNumber - 1] as keyof typeof uiSchema;
};
