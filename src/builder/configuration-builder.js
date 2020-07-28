/** @typedef {Object} DatabaseConfiguration
 * @property {String} client
 * @property {Object} connection
 * @property {string} connection.host
 * @property {number} connection.port
 * @property {string} connection.username
 * @property {string} connection.password
 * @property {string} connection.database
 */

/** @typedef CorsConfiguration
 * @type {Object}
 * @property {string} test
 * @property {string} origin
 * @property {Array} allowMethods
 * @property {string[]} allowHeaders
 */

function configurationBuilder(builder) {
  /**
   * this method add a native middleware before all cockpit configuration
   * here you can add new routes, authentication services or any type of configuration
   * @param {Function} middleware - koa native middleware
   */
  function addMiddleware(middleware) {
    builder.useMiddlewareBeforeValidation(middleware);
  }

  /**
   * add compose module to builder
   * @param {Function} middleware - koa native middleware
   */
  function addCompose(compose) {
    builder.addCompose(compose);
  }

  /**
   * add compose module to builder
   * @param {Object} cockpit - flowbuild/cockpit
   */
  function addCockpit(cockpit) {
    builder.addCockpit(cockpit);
  }

  /**
   * @param {number} port
   */
  function setPort(port) {
    builder.setPort(port);
  }

  /**
   *
   * @param {CorsConfiguration} corsConfig
   */
  function setCors(corsConfig) {
    builder.setCors(corsConfig);
  }

  /**
   *
   * @param {DatabaseConfiguration} dbConfig
   */
  function setDatabaseConfig(dbConfig) {
    builder.setDatabaseConfig(dbConfig);
  }

  return {
    addMiddleware,
    setPort,
    setCors,
    setDatabaseConfig,
    addCompose,
    addCockpit,
  };
}

module.exports = configurationBuilder;
