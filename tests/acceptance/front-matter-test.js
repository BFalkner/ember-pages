import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';
import metaData from 'dummy/pages/meta-data';

var application;

module('Acceptance: FrontMatter', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('meta-data has url', function(assert) {
  var postURLWithoutFrontMatter = '/pages/blog-posts/2015-04-01-test.html',
      metaForPost = Ember.A(metaData.pages['blog-posts']).find(function(p) {
        return p.url === postURLWithoutFrontMatter; });

  assert.ok(metaForPost);
});

test('meta-data has yaml data', function(assert){
  var postURLWithFrontMatter = '/pages/blog-posts/2015-04-03-test-yaml.html',
      metaForPost = Ember.A(metaData.pages['blog-posts']).find(function(p) {
        return p.url === postURLWithFrontMatter; });

  assert.equal(metaForPost.title, 'Front Matter Test');
});
