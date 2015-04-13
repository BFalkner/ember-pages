var Filter = require('broccoli-filter');

function TrimFilter(inputTree, options) {
  Filter.call(this, inputTree, options);
}

TrimFilter.prototype = Object.create(Filter.prototype);
TrimFilter.prototype.constructor = TrimFilter;
TrimFilter.prototype.extensions = ['md'];
TrimFilter.prototype.targetExtension = 'md';

var YAML_FRONT_MATTER_REGEXP = /^(---\s*\r?\n.*?\r?\n?)^((---|\.\.\.)\s*$\r?\n?)/m;
TrimFilter.prototype.processString = function(string) {
  return string.replace(YAML_FRONT_MATTER_REGEXP, '');
}

module.exports = TrimFilter;
