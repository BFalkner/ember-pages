var stringUtils = require('ember-cli/lib/utilities/string'),
    SilentError = require('ember-cli/lib/errors/silent'),
    EOL = require('os').EOL,
    _ = require('lodash'),
    inflection = require('inflection');

module.exports = {
  description: 'Creates a static page.',

  locals: function(options) {
    if (options.entity.options.title === undefined)
      throw new SilentError("Title is required. ex: `ember generate page " +
                                options.entity.name + ' title:"My Title"`');

    return {
      attrs: _(options.entity.options)
        .pairs()
        .map(function(pair) {
          return stringUtils.dasherize(pair[0]) + ": " + pair[1];
        })
        .join(EOL),
      name: stringUtils.dasherize(options.entity.options.title),
      type: inflection.pluralize(stringUtils.dasherize(options.entity.name))
    };
  },

  fileMapTokens: function() {
    return {
      __type__: function(options) {
        return options.locals.type;
      },
      __name__: function(options) {
        return options.locals.name;
      }
    };
  }
};
