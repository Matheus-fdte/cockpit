function configurationBuilder(builder) {
/**
 * @param {Function} middleware - koa native middleware
 */
  // eslint-disable-next-line max-len
  function addConfigurationMiddleware(middleware) {
    builder.useMiddwareBeforeValidation(middleware);
  }
  // TODO: add compose DOC
  function addCompose(fn) {
    builder.addCompose(fn);
  }
  return {
    addConfigurationMiddleware,
    addCompose,
  };
}

module.exports = configurationBuilder;
