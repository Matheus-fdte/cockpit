const serviceBuilder = require('../services-builder');
const Builder = require('../builder');

test('check serviceBuilder redirect', () => {
  let expected;
  const testBuilder = {
    useMiddlewareAfterValidation: (fn) => {
      expected = fn;
    },
  };
  const serviceBuilderinstance = serviceBuilder(testBuilder);
  serviceBuilderinstance.addMiddleware('test works');

  expect(expected).toBe('test works');
});

test('check serviceBuilder add middleware dependency', () => {
  const builder = new Builder();
  const testMethod = () => {};

  const serviceBuilderinstance = serviceBuilder(builder);
  serviceBuilderinstance.addMiddleware(testMethod);

  expect(builder.middlewaresAfterValidation[0]).toBe(testMethod);
});
