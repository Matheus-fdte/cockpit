/* eslint-disable import/no-extraneous-dependencies */
const {
  Cockpit: CockpitInstance,
} = require('@flowbuild/engine');
const jwt = require('koa-jwt');
const debug = require('debug')('flowbuild:cockpit');
const Cockpit = require('./builder');

async function simpleServer() {
  const cockpit = await new Cockpit()
    .addConfiguration(({
      addMiddleware,
      setCors,
      setPort,
      addCockpit,
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
      addCockpit(new CockpitInstance('memory'));
    })
    .start(() => {
    // eslint-disable-next-line no-console
      debug('buider: simple cockpit api start successfully on port 3000');
    });
  return cockpit;
}

module.exports = simpleServer;
