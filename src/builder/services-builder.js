function serviceBuilder(builder) {
  function addMiddleware(fn) {
    builder.useMiddlewareAfterValidation(fn);
  }

  return {
    addMiddleware,
  };
}

module.exports = serviceBuilder;
