/* global stop, start */

import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';

var application;

module('Acceptance: PageAdapter', {
  beforeEach: function() {
    application = startApp();
    this.store = application.__container__.lookup('store:main');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('Store#find/1', function(assert) {
  stop();
  Ember.run(() => this.store.find('blogPost'))
  .then(posts => assert.equal(posts.get('length'), 2))
  .finally(start);
});

test('Store#find/2 with id', function(assert){
  stop();
  Ember.run(() => this.store.find('blogPost', 1))
  .then(post => assert.equal(post.get('title'), "Front Matter Test"))
  .finally(start);
});

test('Store#find/2 with query', function(assert){
  stop();
  Ember.run(() => this.store.find('blogPost', { title: "Front Matter Test" }))
  .then(({content: [post]}) => {
    assert.equal(post.get('title'), "Front Matter Test");
    assert.equal(post.get('id'), '1', "id is correct");
  })
  .finally(start);
});
