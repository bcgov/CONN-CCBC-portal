import Debug from 'debug';
import { createServer as _createServer } from 'http';
import dotenv from 'dotenv';
import config from '../config.js';

dotenv.config({ path: __dirname + '/../.env' });

const debug = Debug('seq:server');
const hostname = config.get('ORIGIN');
const port = config.get('PORT');

const createServer = (expressServer: any) => {
  expressServer.set('port', port);

  const server = _createServer(expressServer);

  server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });

  server.on('error', onError);
  server.on('listening', onListening);

  function onError(error: { syscall: string; code: any }) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening() {
    const addr = server.address();
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
    debug('Listening on ' + bind);
  }
};

export default createServer;
