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
    this.app = new Koa();
    this.middlewaresBeforeValidation.push(cors(this.config.cors));
    this.middlewaresBeforeValidation.push(bodyParser());
    this.middlewaresBeforeValidation.push(logger());
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

    this.server = this.app.listen(this.config.port, serverStartedCallback);
  }
}

module.exports = CockpitBuilder;
