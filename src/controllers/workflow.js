const { getCockpit } = require('../builder/instances');

const getWorkflowsForActor = async (ctx, next) => {
  const cockpit = getCockpit();
  const { actor_data: actorData } = ctx.state;
  const workflows = await cockpit.getWorkflowsForActor(actorData);
  ctx.status = 200;
  ctx.body = workflows;
  await next();
};

const fetchWorkflow = async (ctx, next) => {
  const cockpit = getCockpit();
  const workflowId = ctx.params.id;
  const workflow = await cockpit.fetchWorkflow(workflowId);
  if (workflow) {
    ctx.status = 200;
    ctx.body = workflow.serialize();
    await next();
  } else {
    ctx.status = 404;
    await next();
  }
};

const saveWorkflow = async (ctx, next) => {
  const cockpit = getCockpit();
  const { name, description, blueprint_spec: blueprintSpec } = ctx.request.body;
  try {
    const workflow = await cockpit.saveWorkflow(
      name,
      description,
      blueprintSpec,
    );
    ctx.status = 201;
    ctx.body = {
      workflow_id: workflow.id,
      workflow_url: `${ctx.header.host}${ctx.url}/${workflow.id}`,
    };
    await next();
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: err };
    await next();
  }
};

module.exports = {
  getWorkflowsForActor,
  fetchWorkflow,
  saveWorkflow,
};
