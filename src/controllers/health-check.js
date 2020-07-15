async function healthCheck(ctx) {
  ctx.status = 200;
  ctx.body = 'flowbuild cockpit api ';
}

module.exports = {
  healthCheck,
};
