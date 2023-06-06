// read all keys from an object with support for nested objects that include arrays of objects
const readAllKeys = (obj) => {
  if (typeof obj !== 'object') {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj.flatMap(readAllKeys);
  }

  return [...Object.keys(obj), ...Object.values(obj).flatMap(readAllKeys)];
};

export default readAllKeys;
