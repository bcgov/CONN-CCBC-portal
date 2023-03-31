import https from 'https';
import { Socket } from 'net';

class CustomHttpsAgent extends https.Agent {
  createConnection(options, callback) {
    let asdf;
    const start = Date.now();
    // @ts-ignore
    const conn: Socket = super.createConnection(options, callback);
    conn.on('lookup', (_err, address, _fam, host) => {
      console.log(
        `Currently trying to connect to: ${address} for host: ${host}`
      );
      asdf = address;
    });
    conn.on('error', () => {
      const end = Date.now();
      console.log(`Connection failed with time: ${end - start}ms`);
      console.log(
        `Connection failed to connect to ${asdf} for host ${options.host}`
      );
    });
    return conn;
  }
}

export default CustomHttpsAgent;
