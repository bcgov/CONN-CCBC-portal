import decodeJwt from 'utils/decodeJwt';

describe('decodeJwt function', () => {
  test('it decodes a JWT token correctly', () => {
    const token =
      'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const decodedToken = decodeJwt(token);

    expect(decodedToken.header.alg).toBe('HS256');
    expect(decodedToken.header.typ).toBe('JWT');
    expect(decodedToken.payload.sub).toBe('1234567890');
    expect(decodedToken.payload.name).toBe('John Doe');
    expect(decodedToken.payload.iat).toBe(1516239022);
  });
});
