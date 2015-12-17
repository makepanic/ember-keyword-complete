import Ember from 'ember';
import config from 'dummy/config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('docs-extend');
  this.route('docs-home');
  this.route('demos', function() {
    this.route('emoji');
    this.route('emoji-and-users');
  });

  this.route('api', function() {
    this.route('keyword-complete');
    this.route('file', {path: ':filename'}, function() {});
  });
});

export default Router;
