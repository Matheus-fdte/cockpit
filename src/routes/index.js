const healthCheckRouter = require('./health-check');

module.exports = () => {
  const healthCheck = healthCheckRouter();

  return [
    healthCheck,
  ];
};
