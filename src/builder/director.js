const debug = require('debug')('flowbuild:cockpit:director');
const Builder = require('./builder');
const extensionTypeIdentifier = require('../utils/extension-type-identifier');
const configurationBuilder = require('./configuration-builder');
const serviceBuilder = require('./services-builder');

const persistMode = 'knex';
const port = 3000;
const cors = {
  origin: '*',
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

/**
 * @typedef AddConfigurationCallbackType
 * @type {object}
 * @property {Function} addConfigurationMiddleware - an method.
 * @property {Function} addCompose - your name.
 */

/**
 * @callback AddConfigurationCallback
 * @param {AddConfigurationCallbackType} config
 */

/**
 * @typedef AddServiceCallbackType
 * @type {object}
 * @property {Function} addConfigurationMiddleware - an method.
 * @property {Function} name - your name.
 * @property {number} age - your age.
 */

/**
 * @callback AddServiceCallback
 * @param {AddServiceCallbackType} config
 */

class CockpitDirector {
  /** Constructor
   * @param {Object} params
   * @param {Number} params.port -servicee api port - default 3000
   * @param {string} params.persistMode - Cockpit states communication: knex || memory
   * @param {Object} params.engineUrl - flowbuild/workflow-api service port url
   *
   * @param {Object} params.db
   * @param {String} params.db.client
   * @param {Object} params.db.connection
   * @param {String} params.db.connection.host
   * @param {Number} params.db.connection.port
   * @param {String} params.db.connection.database
   * @param {String} params.db.connection.username
   * @param {String} params.db.connection.password
   *
   *
   * @param {Object} params.cors
   * @param {Object} params.cors.origin
   * @param {Object} params.cors.allowMethods
   * @param {Object} params.cors.allowHeaders
   *
   */
  constructor(
    params = { persistMode, port, cors },
  ) {
    this.persistMode = params.persistMode || persistMode;
    this.port = params.port || port;
    this.cockpitUrl = params.cockpitUrl;
    this.cors = params.cors || cors;

    if (params.persistMode === persistMode && !params.db) {
      throw new Error('please add database configuration');
    }

    this.dbConfig = params.db;

    debug('builder inicialization');
    this.builder = new Builder(
      this.dbConfig,
      this.port,
      this.cors,
      this.persistMode,
    );

    this.configBuilder = configurationBuilder(this.builder);
    this.serviceBuilder = serviceBuilder(this.builder);
  }

  /**
   * @param {AddConfigurationCallback} configCallback
   */
  addConfiguration(configCallback) {
    const config = {
      ...this.builder.config,
      ...this.configBuilder,
    };
    const configInstance = configCallback(config);
    if (configInstance) {
      const type = Object.getPrototypeOf(configInstance)
        .constructor.name.toLowerCase();
      debug(`add configuration return instace type: ${type}`);
      if (type === 'engine') {
        this.configBuilder.addEngine(configInstance);
      } else if (type === 'cockpit') {
        this.configBuilder.addCockpit(configInstance);
      } else if (type === 'compose') {
        this.configBuilder.addCompose(configInstance);
      } else {
        // eslint-disable-next-line max-len
        debug(`add configuration instace type: ${type} not finded, added as middleware`);
        this.configBuilder.addMiddleware(configInstance);
      }
    }
    return this;
  }

  /**
   * @param {AddServiceCallback} serviceCallback
   */
  addService(serviceCallback) {
    const config = {
      ...this.builder.config,
      ...this.serviceBuilder,
    };
    const configInstance = serviceCallback(config);
    if (!configInstance) {
      const type = extensionTypeIdentifier(configInstance);
      debug(`add service return instace type: ${type}`);
      if (type === 'processStateListener') {
        this.serviceBuilder.addProcesStateListener(configInstance);
      } else if (type === 'activityManagerListener') {
        this.serviceBuilder.addActivityManagerListener(configInstance);
      } else {
        // eslint-disable-next-line max-len
        debug(`add service instace type: ${type} not finded, added as middleware`);
        this.serviceBuilder.addMiddleware(configInstance);
      }
    }
    return this;
  }

  async start() {
    debug('starting cockpit api');
    await this.builder.startEngine();
    this.builder.startServer();
    this.server = this.builder.server;

    return this;
  }
}

module.exports = CockpitDirector;
