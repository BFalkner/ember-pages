var markdown = require('markdown').markdown,
    Filter = require('broccoli-filter');

function MarkdownFilter(inputTree, options) {
  Filter.call(this, inputTree, options);
}

MarkdownFilter.prototype = Object.create(Filter.prototype);
MarkdownFilter.prototype.constructor = MarkdownFilter;
MarkdownFilter.prototype.extensions = ['md'];
MarkdownFilter.prototype.targetExtension = 'html';

MarkdownFilter.prototype.processString = function(string) {
  return markdown.toHTML(string);
}

module.exports = MarkdownFilter;
