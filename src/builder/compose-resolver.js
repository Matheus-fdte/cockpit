const debug = require('debug')('flowbuild:cockpit:compose-resolver');

const a = (builder, resolvedPlugins) => {
  resolvedPlugins.forEach((plugin) => {
    const pluginData = {
      input: plugin.input,
    };
    if (plugin.required && plugin.required.length > 0) {
      plugin.required.forEach((required) => {
        pluginData[required.toLowerCase()] = builder[required.toLowerCase()];
      });
    }

    if (plugin.type === 'process_state_listener') {
      builder.addProcessStateListeners((state, actorData) => {
        const input = {
          ...pluginData,
          state,
          actorData,
        };

        plugin.method(input);
      });
    } else if (plugin.type === 'activity_manager_listener') {
      builder.addActivityManagerListeners((activity) => {
        const input = {
          ...pluginData,
          activity,
        };

        plugin.method(input);
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
};

module.exports = a;
