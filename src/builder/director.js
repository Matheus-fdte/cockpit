const debug = require('debug')('flowbuild:cockpit');
const Builder = require('./builder');
const configurationBuilder = require('./configuration-builder');
const serviceBuilder = require('./services-builder');

/**
 * @callback AddConfigurationCallback
 * @param {AddConfigurationCallbackType} config
 */

/**
 * @typedef AddServiceCallbackType
 * @type {object}
 * @property {Function} addServiceMiddleware - an method.
 */

/**
 * @callback AddServiceCallback
 * @param {AddServiceCallbackType} config
 */

class CockpitDirector {
  constructor(
  ) {
    debug('director: builder inicialization');
    this.builder = new Builder();

    this.configBuilder = configurationBuilder(this.builder);
    this.serviceBuilder = serviceBuilder(this.builder);
  }

  /**
   * @param {AddConfigurationCallback} configCallback
   */
  addConfiguration(configCallback) {
    const config = {
      ...this.configBuilder,
      ...this.builder.config,
    };
    configCallback(config);
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
    serviceCallback(config);

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
