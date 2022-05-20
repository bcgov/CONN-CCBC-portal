import type { JSONSchema7 } from 'json-schema';
/**
 * @param schema A valid JSON schema
 * @returns an array of the the schema properties with the following structure:
 * [ [key, value] ]
 */
export const schemaToSubschemasArray = (schema: JSONSchema7) => {
  return Object.entries(schema.properties as any)
}
