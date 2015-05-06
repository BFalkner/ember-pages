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
    var data = this._dataForType(type)[id];

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

    Ember.assert(fmt("Create new %@ using `ember generate page %@ title:<name>`", classesName, typeName));
    throw new Ember.Error("Creation is not supported by PageAdapter");
  },

  updateRecord: function(/* store, type, snapshot */) {
    throw new Ember.Error("Updating is not supported by PageAdapter");
  },

  deleteRecord: function(/* store, type, snapshot */) {
    throw new Ember.Error("Deletion is not supported by PageAdapter");
  },

  findAll(store, type /*, sinceToken */) {
    var allData = this._dataForType(type);

    return new Ember.RSVP.Promise((resolve, reject) =>
      allData ?
        Ember.RSVP.all(allData.map((data, id) => fetch(data, id)))
        .then(
          (records) => Ember.run(null, resolve, records),
          () => Ember.run(null, reject))
      : reject()
    );
  },

  findQuery: function(store, type, query) {
    const queryArray = this._queryArray(query),
          data = this._dataForType(type),
          selected = Ember.A(data)
            .filter((record) => queryArray.every(q => record[q[0]] === q[1]));

    return Ember.RSVP.all(selected.map((data, id) => fetch(data, id)));
  },

  _dataForType(type) {
    return metaData.pages[pluralize(type.typeKey)];
  },

  _queryArray(query) {
    var ret = [];
    for (var key in query) {
      ret.push([key, query[key]]);
    }
    return ret;
  }
});
