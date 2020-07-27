// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('koa-jwt');
const debug = require('debug')('flowbuild:cockpit');
const Cockpit = require('./builder');

async function simpleServer() {
  const cockpit = await new Cockpit()
    .addConfiguration(({
      addMiddleware,
      setCors,
      setPort,
    }) => {
      setPort(3000);
      setCors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'DELETE'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
      });
      addMiddleware(jwt({
        secret: '1234',
      }));
    })
    .start(() => {
    // eslint-disable-next-line no-console
      debug('buider: simple cockpit api start successfully on port 3000');
    });
  return cockpit;
}

module.exports = simpleServer;
