const Router = require('koa-router');
const healthCheckRouter = require('./health-check');
const { captureActorData } = require('../middlewares');

module.exports = () => {
  const hcRouter = healthCheckRouter();

  const mainRouter = new Router();
  mainRouter.use(captureActorData);
  mainRouter.use(hcRouter.middleware());
  return mainRouter;
};
