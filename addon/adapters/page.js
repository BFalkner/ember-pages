import DS from 'ember-data';
import Ember from 'ember';

import metaData from 'ember-pages/pages/meta-data';

var classify = Ember.String.classify,
    dasherize = Ember.String.dasherize,
    pluralize = Ember.String.pluralize,
    fmt = Ember.String.fmt;

export default DS.Adapter.extend({
  find: function(store, type, id /*, snapshot */) {
    var data = metaData.pages[pluralize(type.typeKey)][id];

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (data) {
        data.id = id;
        Ember.$.ajax(data.url).then(function(res) {
          Ember.run(function() {
            data.body = res;
            resolve(data);
          });
        }, function(jqXHR) {
          jqXHR.then = null;
          Ember.run(null, reject, jqXHR);
        });
      } else { reject(); }
    });
  },

  createRecord: function(store, type /*, snapshot */) {
    var classesName = pluralize(classify(type.typeKey)),
        typeName = dasherize(type.typeKey);

    Ember.assert(fmt("Create new %@ using `ember generate page %@ <name>`", classesName, typeName));
    throw new Ember.Error("Creation is not supported by PageAdapter");
  },

  updateRecord: function(/* store, type, snapshot */) {
    throw new Ember.Error("Updating is not supported by PageAdapter");
  },

  deleteRecord: function(/* store, type, snapshot */) {
    throw new Ember.Error("Deletion is not supported by PageAdapter");
  },

  findAll: function(/* store, type, sinceToken */) {

  },

  findQuery: function(/* store, type, query */) {

  }
});
