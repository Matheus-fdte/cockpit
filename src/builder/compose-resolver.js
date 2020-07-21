const debug = require('debug')('flowbuild:cockpit:compose-resolver');

async function composeResolver(builder, resolvedPlugins) {
  resolvedPlugins.forEach(async (plugin) => {
    const pluginData = {
      input: plugin.input,
    };
    if (plugin.required && plugin.required.length > 0) {
      plugin.required.forEach((required) => {
        pluginData[required.toLowerCase()] = builder[required.toLowerCase()];
      });
    } else if (plugin.type === 'configuration_middleware') {
      builder.useMiddwareBeforeValidation((ctx, next) => {
        const input = {
          ...pluginData,
          ctx,
          next,
        };

        plugin.method(input);
      });
    } else if (plugin.type === 'service_middleware') {
      builder.useMiddwareAfterValidation((ctx, next) => {
        const input = {
          ...pluginData,
          ctx,
          next,
        };

        plugin.method(input);
      });
    }

    debug(`plugin ${plugin.name} of type: ${plugin.type} added`);
  });
}

module.exports = composeResolver;
