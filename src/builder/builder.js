// koa imports
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors');
const debug = require('debug')('flowbuild:cockpit');
// internal imports
const dbConnection = require('./database');
const CockpitRouter = require('../routes');
const composeresolver = require('./compose-resolver');

class CockpitBuilder {
  constructor() {
    this.config = {};

    this.middlewaresBeforeValidation = [];
    this.middlewaresAfterValidation = [];
  }

  setPort(port) {
    this.config.port = port;
  }

  setPersistMode(persistMode) {
    this.config.persistMode = persistMode;
  }

  setCors(corsConfig) {
    this.config.cors = corsConfig;
  }

  setDatabaseConfig(dbConfig) {
    this.config.dbConfig = dbConfig;
  }

  addCompose(compose) {
    if (compose) {
      this.compose = compose;
    } else {
      throw new Error('Invalid compose');
    }
  }

  useMiddlewareBeforeValidation(fn) {
    this.middlewaresBeforeValidation.push(fn);
  }

  useMiddlewareAfterValidation(fn) {
    this.middlewaresAfterValidation.push(fn);
  }

  configureServer() {
    this.app = new Koa();
    this.middlewaresBeforeValidation.push(cors(this.config.cors));
    this.middlewaresBeforeValidation.push(bodyParser());
    this.middlewaresBeforeValidation.push(logger());
  }

  configureDb() {
    if (this.config.persistMode === 'knex') {
      this.config.db = dbConnection(this.config.dbConfig);
    }
  }

  async startEngine() {
    try {
      if (this.compose) {
        debug('builder: resolving compose');
        const composeResult = await this.compose.resolve();
        if (composeResult) {
          composeresolver(this, composeResult);
          debug('builder: compose resolved');
        } else {
          debug('builder: compose failed');
        }
      }
    } catch (e) {
      debug(e.message);
    }
  }

  startServer() {
    this.configureDb();
    this.configureServer();

    debug('builder: adding middlewares');
    this.middlewaresBeforeValidation.forEach((md) => this.app.use(md));
    const cockpitRouter = CockpitRouter();
    this.app.use(cockpitRouter.routes());
    this.app.use(cockpitRouter.allowedMethods());
    this.middlewaresAfterValidation.forEach((md) => this.app.use(md));

    this.server = this.app.listen(this.config.port, () => {
      // eslint-disable-next-line max-len
      debug(`buider: Cockpit api start successfully on port ${this.config.port}`);
    });
  }
}

module.exports = CockpitBuilder;
