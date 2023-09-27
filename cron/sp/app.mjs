import * as https from 'https';
import * as http from 'http';
import { stringify } from 'querystring';

// Setup
const keycloakHost = process.env.KEYCLOAK_URL || 'dev.loginproxy.gov.bc.ca';
const serverUrl = process.env.SERVER_URL || '';
const serverPath = process.env.SERVER_PATH || '';
const serverPort = process.env.SERVER_PORT || 443;
const clientId = process.env.CLIENT_ID || '';
const clientSecret = process.env.CLIENT_SECRET || '';

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
  //Handling both http and https requests
  // TODO: change depending on how the final trigger is called (service or route)
  const remoteUrl = new URL(serverUrl);
  const isHttps = remoteUrl.protocol === 'https:';

  const httpClient = isHttps ? https : http;

  const options = {
    hostname: remoteUrl.hostname,
    port: parseInt(serverPort, 10),
    path: serverPath,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = httpClient.request(options, (res) => {
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
    console.log('Access token:', accessToken);
    const response = await triggerImport(accessToken);
    console.log('Response', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function to trigger the import
main();
