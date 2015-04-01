/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel'),
    MarkdownFilter = require('./lib/filters/markdown');

module.exports = {
  name: 'ember-pages',

  treeForPublic: function() {
    return new MarkdownFilter(new Funnel(this.app.trees.app, {
      srcDir: '/pages',
      include: ['**/*.md'],
      destDir: '/pages',
      allowEmpty: true
    }));
  }
};
