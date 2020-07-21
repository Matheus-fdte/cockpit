const databaseConnectionConstructor = require('../database');

test('client null vaildation failed', async () => {
  const dbConfig = {};
  try {
    await databaseConnectionConstructor(dbConfig);
  } catch (e) {
    expect(e.message)
      .toBe("knex: Required configuration option 'client' is missing.");
  }
});

test('client pg vaildation failed without connection', async () => {
  const dbConfig = {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'your_database_user',
      password: 'your_database_password',
      database: 'myapp_test',
    },
  };
  try {
    await databaseConnectionConstructor(dbConfig);
  } catch (e) {
    expect(e.message)
      .toBe("knex: Required configuration option 'client' is missing.");
  }
});
