/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('koa-jwt');
const { Compose } = require('@flowbuild/compose');
const debug = require('debug')('flowbuild:cockpit');
const Cockpit = require('./builder');

async function composedServer() {
  const cockpit = await new Cockpit()
    .addConfiguration(({
      addCompose,
      addMiddleware,
      setCors,
      setDatabaseConfig,
      setPort,
    }) => {
      setPort(3000);
      setDatabaseConfig({
        client: 'pg',
        connection: {
          host: global.process.env.POSTRGES_HOST,
          port: global.process.env.POSTRGES_PORT,
          username: global.process.env.POSTRGES_USERNAME,
          password: global.process.env.POSTRGES_PASSWORD,
          database: global.process.env.POSTRGES_DATABASE,
        },
      });
      setCors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'DELETE'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
      });
      addMiddleware(jwt({
        secret: '1234',
      }));
      addCompose(new Compose());
    })
    .start(() => {
    // eslint-disable-next-line max-len
      debug('buider: composed cockpit api start successfully on port 3000');
    });
  return cockpit;
}

module.exports = composedServer;
