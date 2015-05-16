import DS from 'ember-data';
import Ember from 'ember';

var classify = Ember.String.classify,
    dasherize = Ember.String.dasherize,
    pluralize = Ember.String.pluralize,
    fmt = Ember.String.fmt;

export default DS.Adapter.extend({
  metaData: Ember.inject.service('pages-meta-data'),

  find(store, type, id /*, snapshot */) {
    var data = this._dataForType(type)[id];

    return new Ember.RSVP.Promise((resolve, reject) =>
      data ?
        this._fetch(data).then(
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
        Ember.RSVP.all(allData.map((data) => this._fetch(data)))
        .then(
          (records) => Ember.run(null, resolve, records),
          () => Ember.run(null, reject))
      : reject()
    );
  },

  findQuery: function(store, type, query) {
    const queries = this._pairs(query),
          data = this._dataForType(type),
          selected = Ember.A(data)
            .filter((record) => queries.every(q => record[q[0]] === q[1]));

    return Ember.RSVP.all(selected.map((data) => this._fetch(data)));
  },

  _fetch(data) {
    var d = this._copyObj(data);
    return Ember.$.ajax(d.url).then(function(res) {
        d.body = res;
        return d;
    }, function(jqXHR) {
      jqXHR.then = null;
      return jqXHR;
    });
  },

  _dataForType(type) {
    return this.get(`metaData.pages.${pluralize(type.typeKey)}`);
  },

  _pairs(obj) {
    var ret = [];
    for (var key in obj) {
      ret.push([key, obj[key]]);
    }
    return ret;
  },

  _copyObj(obj) {
    var ret = {};
    for (var key in obj) {
      ret[key] = obj[key];
    }
    return ret;
  }
});
