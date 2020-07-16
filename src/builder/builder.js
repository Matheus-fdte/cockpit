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
        debug('resolving compose');
        const composeResult = await this.compose.resolve();
        if (composeResult) {
          composeresolver(this, composeResult);
          debug('compose resolved');
        } else {
          debug('compose failed');
        }
      }

      if (this.engine) {
        debug('adding activity-manager notifiers');
        this.engine.setActivityManagerNotifier(
          (activityManagerNotification) => {
            this.activityManagerNotifiers.forEach((listener) => {
              listener(activityManagerNotification);
            });
          },
        );

        debug('adding process-states notifiers');
        this.engine.setProcessStateNotifier((processStateNotification) => {
          this.processStateListeners.forEach((listener) => {
            listener(processStateNotification);
          });
        });
        debug('notifiers resolved');
      } else {
        // throw new Error('please add flowbuild engine');
      }

      if (this.cockpit) {
        debug('cockpit added');
      } else {
        // throw new Error('please add flowbuild cockpit');
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
