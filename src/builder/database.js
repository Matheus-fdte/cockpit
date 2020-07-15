const Knex = require('knex');
const dbValidation = require('../validators/database-config');

const databaseConnectionConstructor = (dbConfig) => {
  if (!dbValidation(dbConfig)) {
    throw new Error('this database config not contain all required properties');
  }
  return Knex(dbConfig);
};

module.exports = databaseConnectionConstructor;
