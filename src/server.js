const composed = require('./composed-server');
const simple = require('./simple-server');

if (global.process.env.COMPOSED) {
  composed();
} else {
  simple();
}
