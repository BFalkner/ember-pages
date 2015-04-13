/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel'),
    Markdown = require('./lib/compilers/markdown'),
    FrontMatter = require('./lib/compilers/front-matter'),
    Trim = require('./lib/compilers/trim-front-matter'),
    mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-pages',

  treeForAddon: function(tree) {
    var frontMatter = new FrontMatter(this._pagesTree()),
        combinedTree = mergeTrees([tree, frontMatter]);

    return this._super.treeForAddon.call(this, combinedTree);
  },

  treeForPublic: function() {
    return new Markdown(new Trim(this._pagesTree()));
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
