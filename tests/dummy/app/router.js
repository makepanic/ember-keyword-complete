import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('docs-extend');
  this.route('docs-home');
  this.route('demos', function() {
    this.route('emoji');
    this.route('emoji-and-users');
    this.route('actions');
  });

  this.route('api', function() {
    this.route('keyword-complete');
    this.route('file', {path: ':filename'}, function() {});
  });
});

export default Router;
