const replaceEmptyArrays = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceEmptyArrays(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    if (Array.isArray(obj[key]) && obj[key].length === 0) {
      acc[key] = null;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      acc[key] = replaceEmptyArrays(obj[key]);
    } else {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

// eslint-disable-next-line import/prefer-default-export
export { replaceEmptyArrays };
