/* eslint-disable import/no-cycle */
import https from 'https';
import { Socket } from 'net';
import { reportServerError } from './emails/errorNotification';

class CustomHttpsAgent extends https.Agent {
  createConnection(options, callback) {
    let ipAddress;
    const start = Date.now();
    // @ts-ignore
    const conn: Socket = super.createConnection(options, callback);
    conn.on('lookup', (_err, address) => {
      ipAddress = address;
    });
    conn.on('error', () => {
      const end = Date.now();
      reportServerError(
        new Error(
          `Connection failed to connect to ${ipAddress} for host ${
            options.host
          } after waiting ${end - start}ms `
        ),
        {
          source: 'custom-https-agent',
          metadata: { ipAddress, host: options.host },
        }
      );
    });
    return conn;
  }
}

export default CustomHttpsAgent;
