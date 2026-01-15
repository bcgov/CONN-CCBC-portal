/* eslint-disable import/first */
/**
 * @jest-environment node
 */

jest.mock('../../../backend/lib/emails/errorNotification', () => ({
  reportServerError: jest.fn(),
}));

import { reportServerError } from '../../../backend/lib/emails/errorNotification';
import CustomHttpsAgent from '../../../backend/lib/CustomHttpsAgent';

describe('Custom https agent', () => {
  it('should call the createConnection function', async () => {
    const agent = new CustomHttpsAgent({
      keepAlive: true,
      keepAliveMsecs: 10000,
      maxSockets: 50,
      maxFreeSockets: 10,
      timeout: 60000,
      rejectUnauthorized: false,
    });

    const spy = jest.spyOn(agent, 'createConnection');

    agent.createConnection(
      {
        host: 'host',
        port: 443,
        localAddress: '127.0.0.1',
        family: 4,
        hints: 0,
        lookup: jest.fn(),
      },
      () => ({}) // callback
    );

    expect(spy).toHaveBeenCalled();
  });

  it('should call the createConnection function with the correct parameters', async () => {
    const agent = new CustomHttpsAgent({
      keepAlive: true,
      keepAliveMsecs: 10000,
      maxSockets: 50,
      maxFreeSockets: 10,
      timeout: 60000,
      rejectUnauthorized: false,
    });

    const spy = jest.spyOn(agent, 'createConnection');

    agent.createConnection(
      {
        host: 'host',
        port: 443,
        localAddress: '127.0.0.1',
        family: 4,
        hints: 0,
        lookup: jest.fn(),
      },
      () => ({}) // callback
    );

    expect(spy).toHaveBeenCalledWith(
      {
        host: 'host',
        port: 443,
        localAddress: '127.0.0.1',
        family: 4,
        hints: 0,
        lookup: expect.any(Function),
      },
      expect.any(Function)
    );
  });

  it('should call the createConnection function with the correct parameters and return a socket', async () => {
    const agent = new CustomHttpsAgent({
      keepAlive: true,
      keepAliveMsecs: 10000,
      maxSockets: 50,
      maxFreeSockets: 10,
      timeout: 60000,
      rejectUnauthorized: false,
    });

    const spy = jest.spyOn(agent, 'createConnection');

    agent.createConnection(
      {
        host: 'host',
        port: 443,
        localAddress: '127.0.0.1',
        family: 4,
        hints: 0,
        lookup: jest.fn(),
      },
      () => ({}) // callback
    );

    const socket = spy.mock.results[0].value;

    expect(socket).toHaveProperty('on');

    expect(socket).toHaveProperty('setTimeout');

    expect(socket).toHaveProperty('setKeepAlive');

    expect(socket).toHaveProperty('setNoDelay');

    expect(socket).toHaveProperty('destroy');

    expect(socket).toHaveProperty('connect');

    expect(socket).toHaveProperty('end');

    expect(socket).toHaveProperty('write');

    expect(socket).toHaveProperty('pause');

    expect(socket).toHaveProperty('resume');

    expect(socket).toHaveProperty('ref');

    expect(socket).toHaveProperty('unref');

    expect(socket).toHaveProperty('address');

    expect(socket).toHaveProperty('remoteAddress');

    expect(socket).toHaveProperty('remoteFamily');

    expect(socket).toHaveProperty('remotePort');

    expect(socket).toHaveProperty('localAddress');

    expect(socket).toHaveProperty('localPort');

    expect(socket).toHaveProperty('bytesRead');

    expect(socket).toHaveProperty('bytesWritten');

    expect(socket).toHaveProperty('connecting');

    expect(socket).toHaveProperty('destroyed');

    expect(socket).toHaveProperty('readable');

    expect(socket).toHaveProperty('writable');

    expect(socket).toHaveProperty('allowHalfOpen');

    expect(socket).toHaveProperty('read');

    expect(socket).toHaveProperty('addListener');

    expect(socket).toHaveProperty('emit');

    expect(socket).toHaveProperty('eventNames');

    expect(socket).toHaveProperty('getMaxListeners');

    expect(socket).toHaveProperty('listenerCount');

    expect(socket).toHaveProperty('listeners');

    expect(socket).toHaveProperty('off');

    expect(socket).toHaveProperty('on');

    expect(socket).toHaveProperty('once');

    expect(socket).toHaveProperty('prependListener');

    expect(socket).toHaveProperty('prependOnceListener');

    expect(socket).toHaveProperty('rawListeners');

    expect(socket).toHaveProperty('removeAllListeners');

    expect(socket).toHaveProperty('removeListener');

    expect(socket).toHaveProperty('setMaxListeners');

    expect(socket).toHaveProperty('write');
  });

  it('should report error on socket failure', async () => {
    const agent = new CustomHttpsAgent({
      keepAlive: true,
      keepAliveMsecs: 10000,
      maxSockets: 50,
      maxFreeSockets: 10,
      timeout: 60000,
      rejectUnauthorized: false,
    });

    const spy = jest.spyOn(agent, 'createConnection');

    agent.createConnection(
      {
        host: 'host',
        port: 443,
        localAddress: '127.0.0.1',
        family: 4,
        hints: 0,
        lookup: jest.fn(),
      },
      () => ({})
    );

    const socket = spy.mock.results[0].value;

    socket.emit('error', new Error('boom'));

    expect(reportServerError).toHaveBeenCalledTimes(1);
  });
});
