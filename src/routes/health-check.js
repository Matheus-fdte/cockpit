const Router = require('koa-router');
const { healthCheckController } = require('../controllers');

module.exports = () => {
  const router = new Router();
  router.get('/', healthCheckController.healthCheck);
  return router;
};
