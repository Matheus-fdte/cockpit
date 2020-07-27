const { TestScheduler } = require('jest');

const { healthCheck } = require('../health-check');

test('health-check return 200', async () => {
  const ctx = {};
  let next_sucess = false;
  const next = async () => {
    expect(ctx.status).toBe(200);
    next_sucess = true;
  };
  await healthCheck(ctx, next);
  expect(next_sucess).toBe(true);
});
