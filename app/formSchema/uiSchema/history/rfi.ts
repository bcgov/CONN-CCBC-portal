import rfi from 'formSchema/analyst//rfiSchema';

const rfiDiffSchema = {
  rfi: {
    ...rfi,
    properties: {
      ...(rfi.properties.rfiAdditionalFiles.properties as Object),
      ...rfi.properties,
    },
  },
};

export default rfiDiffSchema;
