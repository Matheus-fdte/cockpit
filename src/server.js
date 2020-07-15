/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('koa-jwt');
const Cockpit = require('./builder');

// dev mode file
const startServer = async (port, dbConfig, secret) => {
  const cockpitSpec = {
    port: port || 3000,
    persistMode: 'knex',
    db: dbConfig || {
      client: 'pg',
      connection: {
        host: global.process.env.POSTRGES_HOST,
        port: global.process.env.POSTRGES_PORT,
        username: global.process.env.POSTRGES_USERNAME,
        password: global.process.env.POSTRGES_PASSWORD,
        database: global.process.env.POSTRGES_DATABASE,
      },
    },
  };
  const cockpit = await new Cockpit(cockpitSpec)
    .addConfiguration(({ addConfigurationMiddleware }) => {
      addConfigurationMiddleware(jwt({
        secret: secret || global.process.env.JWT_SECRET,
      }));
    })
    .start();

  return cockpit.server;
};

module.exports = startServer;
