// koa imports
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors');
const debug = require('debug')('flowbuild:cockpit:builder');
// internal imports
const dbConnection = require('./database');
const routes = require('../routes');
// const { setCockpit, setEngine } = require('../engine');
const { captureActorData } = require('../middlewares');
const composeresolver = require('./compose-resolver');

class CockpitBuilder {
  constructor(_dbConfig, _port, _cors, _persistMode) {
    this.config = {
      dbConfig: _dbConfig,
      port: _port,
      cors: _cors,
      persistMode: _persistMode,
    };

    this.processStateListeners = [];
    this.activityManagerListeners = [];
    this.middlewaresBeforeValidation = [];
    this.middlewaresAfterValidation = [];

    this.configureDb();
    this.configureServer();
  }

  configureServer() {
    this.app = new Koa();
    this.middlewaresBeforeValidation.push(cors(this.cors));
    this.middlewaresBeforeValidation.push(bodyParser());
    this.middlewaresBeforeValidation.push(logger());
  }

  configureDb() {
    if (this.persistMode === 'knex') {
      this.config.db = dbConnection(this.config.dbConfig);
    }
  }

  addCompose(compose) {
    if (compose) {
      this.compose = compose;
    } else {
      throw new Error('Invalid compose');
    }
  }

  addEngine(engine) {
    if (engine && !this.engine) {
      this.engine = engine;
    } else {
      throw new Error('Invalid engine');
    }
  }

  addCockpit(cockpit) {
    if (cockpit && !this.cockpit) {
      this.cockpit = cockpit;
    } else {
      throw new Error('Invalid Cockpit');
    }
  }

  useMiddwareBeforeValidation(fn) {
    this.middlewaresBeforeValidation.push(fn);
  }

  useMiddwareAfterValidation(fn) {
    this.middlewaresAfterValidation.push(fn);
  }

  addProcessStateListeners(fn) {
    this.processStateListeners.push(fn);
  }

  addActivityManagerListeners(fn) {
    this.activityManagerListeners.push(fn);
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
    debug('adding middlewares');
    this.middlewaresBeforeValidation.forEach((md) => this.app.use(md));
    this.app.use(captureActorData);
    this.middlewaresAfterValidation.forEach((md) => this.app.use(md));
    routes().forEach((route) => {
      this.app.use(route.routes());
      this.app.use(route.allowedMethods());
    });

    this.server = this.app.listen(this.config.port, () => {
      debug(`Cockpit api start successfully on port ${this.config.port}`);
    });
  }
}

module.exports = CockpitBuilder;
