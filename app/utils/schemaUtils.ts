import { uiSchema } from 'formSchema';
import type { JSONSchema7 } from 'json-schema';
/**
 * @param schema A valid JSON schema
 * @returns an array of the the schema properties with the following structure:
 * [ [<section title>, <section schema>] ]
 */
export const schemaToSubschemasArray = (
  schema: JSONSchema7
): [string, unknown][] => {
  return Object.entries(schema.properties as any);
};

export const getSectionNameFromPageNumber = (
  pageNumber: number
): keyof typeof uiSchema => {
  return uiSchema['ui:order'][pageNumber - 1] as keyof typeof uiSchema;
};
