import https from 'https';
import { Socket } from 'net';
import * as Sentry from '@sentry/nextjs';

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
      Sentry.captureException(
        new Error(
          `Connection failed to connect to ${ipAddress} for host ${
            options.host
          } after waiting ${end - start}ms `
        )
      );
    });
    return conn;
  }
}

export default CustomHttpsAgent;
