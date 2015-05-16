import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('service:pages-meta-data', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});


test('has pages', function(assert) {
  var service = this.subject(),
      pages = service.get('pages');

  assert.ok(pages);
  assert.equal(pages.get('blogPosts.length'), 2);
  assert.equal(pages.get('blogPosts.firstObject.id'), 0, 'pages have an id');
});
