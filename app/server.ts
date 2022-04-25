import next from 'next';
import express from 'express';
import createServer from './backend/create-server';
import postgraphileMiddleware from './backend/lib/postgraphile';

const dev = process.env.NODE_ENV != 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  server.use(postgraphileMiddleware());

  server.all('*', async (req, res) => handle(req, res));

  createServer(server);
});
