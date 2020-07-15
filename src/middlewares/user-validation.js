const captureActorData = async (ctx, next) => {
  if (!ctx.state.user) {
    ctx.throw(401, 'User data not found');
  }
  const { actor_id: actorId, claims } = ctx.state.user;
  if (!actorId) {
    ctx.throw(401, 'Actor id not found');
  }

  if (!Array.isArray(claims)) {
    ctx.throw(401, 'Invalid claims');
  }

  ctx.state.actor_data = {
    actor_id: actorId,
    claims,
  };

  await next();
};

module.exports = captureActorData;
