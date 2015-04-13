import DS from 'ember-data';
import Ember from 'ember';

import metaData from 'ember-pages/pages/meta-data';

var classify = Ember.String.classify,
    dasherize = Ember.String.dasherize,
    pluralize = Ember.String.pluralize,
    fmt = Ember.String.fmt;

function fetch(data, id) {
  return Ember.$.ajax(data.url).then(function(res) {
      data.id = id;
      data.body = res;
      return data;
  }, function(jqXHR) {
    jqXHR.then = null;
    return jqXHR;
  });
}

export default DS.Adapter.extend({
  find: function(store, type, id /*, snapshot */) {
    var data = metaData.pages[pluralize(type.typeKey)][id];

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (data) {
        fetch(data, id).then(
          function(record) { Ember.run(null, resolve, record); },
          function(failure) { Ember.run(null, reject, failure); });
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

  findAll: function(store, type /*, sinceToken */) {
    var allData = metaData.pages[pluralize(type.typeKey)];

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (allData) {
        Ember.RSVP.all(allData.map(function(data, id) {
          return fetch(data, id);
        })).then(
          function(records) { Ember.run(null, resolve, records); },
          function() { Ember.run(null, reject); }
        );
      } else { reject(); }
    });
  },

  findQuery: function(/* store, type, query */) {

  }
});
