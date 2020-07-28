const Router = require('koa-router');
const { workflowController: wc } = require('../controllers');
const { workflowValidator: wv } = require('../validators');

module.exports = () => {
  const router = new Router({ prefix: '/workflows' });
  router.get('/', wc.getWorkflowsForActor);
  router.post('/', wv.saveWorkflow, wc.saveWorkflow);
  router.get('/:id', wc.fetchWorkflow);

  return router;
};
