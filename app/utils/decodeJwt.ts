const decodeJwt = (token: string) => {
  const [header, payload, signature] = token.split('.');
  return {
    header: JSON.parse(Buffer.from(header, 'base64').toString('utf8')),
    payload: JSON.parse(Buffer.from(payload, 'base64').toString('utf8')),
    signature,
  };
};

export default decodeJwt;
