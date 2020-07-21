const configurationBuilder = require('../configuration-builder');
const Builder = require('../builder');

test('check configurationBuilder redirect', () => {
  let expected;
  const testBuilder = {
    useMiddlewareBeforeValidation: (fn) => {
      expected = fn;
    },
  };
  const configurationBuilderinstance = configurationBuilder(testBuilder);
  configurationBuilderinstance.addMiddleware('test works');

  expect(expected).toBe('test works');
});

test('check configurationBuilder add middleware dependency', () => {
  const builder = new Builder();
  const testMethod = () => {};

  const configurationBuilderinstance = configurationBuilder(builder);
  configurationBuilderinstance.addMiddleware(testMethod);

  expect(builder.middlewaresBeforeValidation[0]).toBe(testMethod);
});

test('check configurationBuilder set cors configuration to builder', () => {
  const builder = new Builder();
  const cors = {
    origin: '*',
    allowHeaders: ['foo', 'bar'],
  };

  const configurationBuilderinstance = configurationBuilder(builder);
  configurationBuilderinstance.setCors(cors);

  expect(builder.config.cors).toBe(cors);
});

test('check configurationBuilder set port configuration to builder', () => {
  const builder = new Builder();
  const port = 3000;
  const configurationBuilderinstance = configurationBuilder(builder);
  configurationBuilderinstance.setPort(port);

  expect(builder.config.port).toBe(port);
});

test('check configurationBuilder set database configuration to builder', () => {
  const builder = new Builder();
  const dbConfig = {
    client: 'pg',
    connection: {
      username: 'cockpit',
      password: '123456',
      port: 5342,
      database: 'cockpit',
    },
  };
  const configurationBuilderinstance = configurationBuilder(builder);
  configurationBuilderinstance.setDatabaseConfig(dbConfig);

  expect(builder.config.dbConfig).toBe(dbConfig);
});

test('check configurationBuilder set compose to builder', () => {
  const builder = new Builder();
  const compose = { resolve: () => {} };
  const configurationBuilderinstance = configurationBuilder(builder);
  configurationBuilderinstance.addCompose(compose);

  expect(builder.compose).toBe(compose);
});
