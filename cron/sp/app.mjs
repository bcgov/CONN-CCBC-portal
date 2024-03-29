import * as https from 'https';
import * as http from 'http';
import { stringify } from 'querystring';

// Setup
const keycloakHost = process.env.KEYCLOAK_HOST || 'dev.loginproxy.gov.bc.ca';
const serverHost = process.env.CCBC_SERVER_HOST || '';
const serverPath = process.env.CCBC_SERVER_PATH || '';
const serverPort = process.env.CCBC_SERVER_PORT || 443;
const clientId = process.env.SA_CLIENT_ID || '';
const clientSecret = process.env.SA_CLIENT_SECRET || '';

// Fetch the access token from Keycloak
function fetchAccessToken() {
  const data = stringify({
    grant_type: 'client_credentials',
  });

  const authHeader = `Basic ${Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString('base64')}`;

  const options = {
    hostname: keycloakHost,
    path: '/auth/realms/standard/protocol/openid-connect/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const tokenData = JSON.parse(data);
          const accessToken = tokenData.access_token;
          resolve(accessToken);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Make a GET request to the server with the access token
function triggerImport(accessToken) {
  const options = {
    hostname: serverHost,
    port: parseInt(serverPort, 10),
    path: serverPath,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Main function to fetch the access token and trigger the import
async function main() {
  try {
    const accessToken = await fetchAccessToken();
    const response = await triggerImport(accessToken);
    console.log('Response', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function to trigger the import
main();
