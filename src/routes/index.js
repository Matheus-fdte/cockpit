const Router = require('koa-router');
// rutes
const healthCheckRouter = require('./health-check');
const workflowRouter = require('./workflow');
// middlewares
const { captureActorData } = require('../middlewares');

module.exports = () => {
  const hcRouter = healthCheckRouter();
  const wRouter = workflowRouter();
  const mainRouter = new Router();
  mainRouter.use(captureActorData);
  mainRouter.use(hcRouter.middleware());
  mainRouter.use(wRouter.middleware());
  return mainRouter;
};
