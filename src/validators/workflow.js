const { validateBodyWithSchema } = require('./base');

const validateSaveWorkflow = validateBodyWithSchema(
  {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      blueprint_spec: { type: 'object' },
    },
    additionalProperties: false,
    required: ['name', 'description', 'blueprint_spec'],
  },
);

const validateCreateProcess = validateBodyWithSchema(
  {
    type: 'object',
  },
);

module.exports = {
  saveWorkflow: validateSaveWorkflow,
  createProcess: validateCreateProcess,
};
