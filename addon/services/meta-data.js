import Ember from 'ember';

import metaData from 'ember-pages/pages/meta-data';

export default Ember.Service.extend({
  pages: Ember.computed(function() {
    var obj = Ember.Object.create(),
        pages = metaData.pages;

    for (var key in pages)
      obj.set(key, Ember.A(pages[key]));

    return obj;
  })
});
