import next from 'next';
import delay from 'delay';
import express from 'express';
import http from 'http';
import { createLightship } from 'lightship';
import { pgPool } from './backend/lib/setup-pg';
import postgraphileMiddleware from './backend/lib/postgraphile';
import config from './config.js';

const port = config.get('PORT');
const dev = config.get('NODE_ENV') != 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  const lightship = createLightship();

  lightship.registerShutdownHandler(async () => {
    // Allow the server to send any in-flight requests before shutting down
    await delay(10000);
    await app.close();
    await pgPool.end();
  });

  server.use(postgraphileMiddleware());

  server.all('*', async (req, res) => handle(req, res));

  http
    .createServer(server)
    .listen(port, () => {
      lightship.signalReady();
      console.log(`> Ready on http://localhost:${port}`);
    })
    .on('error', (err) => {
      console.error(err);
      lightship.shutdown();
    });
});
