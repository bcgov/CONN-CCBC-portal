const getAuthUser = (req: any) => {
  return req?.claims
    ? `${req?.claims?.family_name}, ${req?.claims?.given_name}`
    : 'CCBC User';
};

export default getAuthUser;
