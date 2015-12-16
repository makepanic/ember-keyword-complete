import Ember from 'ember';
import ENV from 'dummy/config/environment';

export default Ember.Controller.extend({
  version: ENV.APP.version
});
