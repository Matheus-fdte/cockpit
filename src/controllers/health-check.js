async function healthCheck(ctx, next) {
  ctx.status = 200;
  ctx.body = 'flowbuild cockpit api ';
  await next();
}

module.exports = {
  healthCheck,
};
