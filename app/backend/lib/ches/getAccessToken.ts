import config from '../../../config';

const CHES_CLIENT = config.get('CHES_CLIENT');
const CHES_CLIENT_SECRET = config.get('CHES_CLIENT_SECRET');
const CHES_KEYCLOAK_HOST = config.get('CHES_KEYCLOAK_HOST');

const getAccessToken = async () => {
  try {
    const authURL = `${CHES_KEYCLOAK_HOST}/auth/realms/comsvcauth/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    const response = await fetch(authURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${CHES_CLIENT}:${CHES_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: params,
    });
    if (!response.ok) {
      throw new Error(`Error getting token with status: ${response.status}`);
    }
    const data = await response.json();
    const token: string = data.access_token;
    return token;
  } catch (error: any) {
    console.error('Error getting CHES access token', error);
    throw new Error(error.message);
  }
};

export default getAccessToken;
