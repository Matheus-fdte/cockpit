const captureActorData = async (ctx, next) => {
  if (!ctx.state) {
    ctx.throw(401, 'State not found');
  } else if (!ctx.state.user) {
    ctx.throw(401, 'User data not found');
  } else {
    const { actor_id: actorId, claims } = ctx.state.user;
    if (!actorId) {
      ctx.throw(401, 'Actor id not found');
    } else if (!Array.isArray(claims)) {
      ctx.throw(401, 'Invalid claims');
    }

    ctx.state.actor_data = {
      actor_id: actorId,
      claims,
    };
  }
  await next();
};

module.exports = captureActorData;
