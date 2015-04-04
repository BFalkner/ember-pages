/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel'),
    Markdown = require('./lib/compilers/markdown'),
    FrontMatter = require('./lib/compilers/front-matter');

module.exports = {
  name: 'ember-pages',

  treeForApp: function() {
    return new FrontMatter(this._pagesTree());
  },

  treeForPublic: function() {
    return new Markdown(this._pagesTree());
  },

  _pagesTree: function() {
    return new Funnel(this.app.trees.app, {
      srcDir: '/pages',
      include: ['**/*.md'],
      destDir: '/pages',
      allowEmpty: true
    });
  }
};
