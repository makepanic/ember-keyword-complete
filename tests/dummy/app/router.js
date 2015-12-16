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
});

export default Router;
