import config from "../../../config";

// Takes a 'cookies' object (key-value pairs in an object)
export const generateForwardedCookieOptions = (cookies, fields) => {
  if (!cookies) return {};
  return fields.reduce((acc, currentKey) => {
    if (cookies[currentKey] !== undefined)
      acc[currentKey] = cookies[currentKey];
    return acc;
  }, {});
};

// if the ENABLE_MOCK_TIME or ENABLE_MOCKS_COOKIES env variable is set,
// creates the settings object needed for postgres to use the mocks schema by default and the fields to retrieve from the cookies
export const generateDatabaseMockOptions = (cookies, fields) => {
  if (!config.get("ENABLE_MOCK_TIME") && !config.get("ENABLE_MOCK_COOKIES"))
    return {};

  return {
    ...generateForwardedCookieOptions(cookies, fields),
    search_path: "mocks,pg_catalog,public",
  };
};
