# Ember-pages [![Build Status](https://travis-ci.org/BFalkner/ember-pages.svg)](https://travis-ci.org/BFalkner/ember-pages) [![Ember Observer Score](http://emberobserver.com/badges/ember-pages.svg)](http://emberobserver.com/addons/ember-pages)

## Installation

* `ember install ember-pages`

## Usage

### Create a model with a body property

    import DS from 'ember-data';

    export default DS.Model.extend({
      title: DS.attr('string'),
      description: DS.attr('string'),
      body: DS.attr('string')
    });

### Set the adapter for your model

    import PageAdapter from 'ember-pages/adapters/page';

    export default PageAdapter.extend({

    });

### Generate some static data

* `ember generate page blogPost title:"Title is required" description:"Set your model property values"`

### Edit your data with markdown

    ---
    title: Title is required
    description: Set your model property values
    ---
    Hello from app/pages/blog-posts/title-is-required.md

### That's it!

    > post = $E.store.find("blogPost", 0)
    h {__nextSuper: undefined, __ember1430412616372: null, __ember_meta__: Object, constructor: function, _super: function…}
    > post.get('title')
    "Title is required"
    > post.get('body')
    "<p>Hello from app/pages/blog-posts/title-is-required.md</p>"

## TODO

For now, most of what Jekyll provides is not handled.
See [Issues](https://github.com/BFalkner/ember-pages/issues) for more information.
