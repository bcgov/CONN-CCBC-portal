import uiSchema from './uiSchema/uiSchema';

const analystEditUiSchema = {
  ...uiSchema,
  projectArea: {
    ...uiSchema.projectArea,
    geographicArea: {
      ...uiSchema.projectArea.geographicArea,
      'ui:options': {
        ...uiSchema.projectArea.geographicArea['ui:options'],
        singleSelection: false,
      },
    },
  },
};
export default analystEditUiSchema;
