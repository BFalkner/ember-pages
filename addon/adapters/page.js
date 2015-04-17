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
  find(store, type, id /*, snapshot */) {
    var data = metaData.pages[pluralize(type.typeKey)][id];

    return new Ember.RSVP.Promise((resolve, reject) =>
      data ?
        fetch(data, id).then(
          (record) => Ember.run(null, resolve, record),
          (failure) => Ember.run(null, reject, failure))
      : reject()
    );
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

  findAll(store, type /*, sinceToken */) {
    var allData = metaData.pages[pluralize(type.typeKey)];

    return new Ember.RSVP.Promise((resolve, reject) =>
      allData ?
        Ember.RSVP.all(allData.map((data, id) => fetch(data, id)))
        .then(
          (records) => Ember.run(null, resolve, records),
          () => Ember.run(null, reject))
      : reject()
    );
  },

  findQuery: function(/* store, type, query */) {

  }
});
