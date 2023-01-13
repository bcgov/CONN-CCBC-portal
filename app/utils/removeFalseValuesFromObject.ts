// Removes keys with falsey values from a shallow object
const removeFalseyValuesFromObject = (object) => {
  const hasKeys = Object.keys(object).length > 0;
  if (!hasKeys) return {};

  return Object.keys(object).reduce((acc, key) => {
    if (object[key]) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
};

export default removeFalseyValuesFromObject;
