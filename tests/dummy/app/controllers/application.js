import Controller from '@ember/controller';
import ENV from 'dummy/config/environment';

export default Controller.extend({
  version: ENV.APP.version
});
