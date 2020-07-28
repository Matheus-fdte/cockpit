// koa imports
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors');
const debug = require('debug')('flowbuild:cockpit');
// internal imports
const dbConnection = require('./database');
const CockpitRouter = require('../routes');
const composeResolver = require('./compose-resolver');
const {
  setCockpit
} = require('./instances');

class CockpitBuilder {
  constructor() {
    this.config = {};

    this.middlewaresBeforeValidation = [];
    this.middlewaresAfterValidation = [];
  }

  setPort(port) {
    this.config.port = port;
  }

  setCors(corsConfig) {
    this.config.cors = corsConfig;
  }

  setDatabaseConfig(dbConfig) {
    this.config.dbConfig = dbConfig;
  }

  addCockpit(cockpit) {
    if (cockpit) {
      this.cockpit = cockpit;
    } else {
      throw new Error('Invalid compose');
    }
  }

  addCompose(compose) {
    if (compose && compose.resolve instanceof Function) {
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
    setCockpit(this.cockpit);
    this.app = new Koa();
    debug('builder: adding middlewares');
    this.middlewaresBeforeValidation.push(cors(this.config.cors));
    this.middlewaresBeforeValidation.push(bodyParser());
    this.middlewaresBeforeValidation.push(logger());
    this.middlewaresBeforeValidation.forEach((md) => this.app.use(md));
    const cockpitRouter = CockpitRouter();
    this.app.use(cockpitRouter.routes());
    this.app.use(cockpitRouter.allowedMethods());
    this.middlewaresAfterValidation.forEach((md) => this.app.use(md));
  }

  configureDb() {
    if (this.config.dbConfig) {
      this.db = dbConnection(this.config.dbConfig);
    }
  }

  async startModules() {
    if (this.compose) {
      debug('builder: resolving compose');
      const composeResult = await this.compose.resolve();
      if (composeResult) {
        composeResolver(this, composeResult);
        debug('builder: compose resolved');
        return true;
      }
      debug('builder: compose failed');
      return false;
    }
    return undefined;
  }

  async startServer(serverStartedCallback) {
    await this.configureDb();
    this.configureServer();
    if (serverStartedCallback) {
      this.server = this.app.listen(this.config.port, serverStartedCallback);
    } else {
      this.server = this.app.listen(this.config.port, () => {
        // eslint-disable-next-line max-len
        debug(`builder: cockpit server started on port ${this.config.port} without onStartCallback`);
      });
    }
  }
}

module.exports = CockpitBuilder;
