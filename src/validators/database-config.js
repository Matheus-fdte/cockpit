const Ajv = require('ajv');

const ajv = new Ajv();

const databaseSchema = {
  type: 'object',
  properties: {
    client: { type: 'string' },
    connection: {
      type: 'object',
      properties: {
        host: { type: 'string' },
        username: { type: 'string' },
        database: { type: 'string' },
        password: { type: 'string' },
        port: { type: 'number' },
      },
      required: ['host', 'port', 'username', 'database', 'password'],
      additionalProperties: false,
    },
  },
  required: ['client', 'connection'],
  additionalProperties: false,
};

const validateDatabaseConfig = async (dbConfig) => {
  await ajv.validate(databaseSchema, dbConfig);
};

module.exports = validateDatabaseConfig;
