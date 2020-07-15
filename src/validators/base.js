const Ajv = require('ajv');

const ajv = new Ajv();

const validateBodyWithSchema = (schema) => async (ctx, next) => {
  const isValid = await ajv.validate(schema, ctx.request.body);
  if (!isValid) {
    ctx.throw(400, 'Invalid request payload.');
  }
  await next();
};

module.exports = {
  validateBodyWithSchema,
};
