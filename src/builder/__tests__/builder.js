/* eslint-disable max-len */
const Builder = require('../builder');

test('check configurationBuilder set database configuration knex correctly', async () => {
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
  builder.config.dbConfig = dbConfig;

  await builder.configureDb();
  expect(builder.db).not.toBe(undefined);
});

test("check fail if compose doens't matches with builder", () => {
  const builder = new Builder();
  const failedCompose = {};
  try {
    builder.addCompose(failedCompose);
  } catch (e) {
    expect(e.message).toBe('Invalid compose');
  }
  expect(builder.compose).toBe(undefined);
});

test("check fail if compose doens't matches with builder", () => {
  const builder = new Builder();
  const compose = { resolve: () => [] };
  builder.addCompose(compose);
  expect(builder.compose).toBe(compose);
});

test('check configurationBuilder setPort add correctly to application', async () => {
  const builder = new Builder();
  const port = 3000;
  builder.config.port = port;

  await builder.startServer();
  expect(builder.server.address().port).toBe(port);
  builder.server.close();
});

test('without error if compose not implemented', async () => {
  const builder = new Builder();
  const port = 3000;
  builder.config.port = port;

  try {
    const composed = await builder.startModules();
    expect(composed).toBe(undefined);
  } catch (e) {
    expect(e).toBe(null);
  }
});

test('thow error if empty compose object implemented', async () => {
  const builder = new Builder();
  const port = 3000;
  builder.config.port = port;
  builder.compose = {};

  try {
    await builder.startModules();
  } catch (e) {
    expect(e.message).toBe('this.compose.resolve is not a function');
  }
});

test('check if compose', async () => {
  const builder = new Builder();
  const port = 3000;
  builder.config.port = port;
  builder.compose = {
    resolve: () => undefined,
  };

  const composed = await builder.startModules();
  expect(composed).toBe(false);
});

test('mocked resolved composed plugins', async () => {
  const builder = new Builder();
  const port = 3000;
  builder.config.port = port;
  builder.compose = {
    resolve: async () => [],
  };

  try {
    const composed = await builder.startModules();
    expect(composed).toBe(true);
  } catch (e) {
    expect(e).toBe(undefined);
  }
});
