const getAuthUser = (req: any) => {
  return req?.claims
    ? {
        familyName: req?.claims?.family_name,
        givenName: req?.claims?.given_name,
      }
    : {
        familyName: 'CCBC Portal',
        givenName: 'Guest User',
      };
};

export default getAuthUser;
