function serviceBuilder(builder) {
  function addServiceMiddleware(fn) {
    builder.useMiddlewareAfterValidation(fn);
  }

  return {
    addServiceMiddleware,
  };
}

module.exports = serviceBuilder;
