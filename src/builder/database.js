const Knex = require('knex');
// FIXME: check if this methods continue really necessary
async function databaseConnectionConstructor(dbConfig) {
  return Knex(dbConfig);
}

module.exports = databaseConnectionConstructor;
