import Ember from 'ember';
import config from 'dummy/config/environment';

export default Ember.Route.extend({
  model(){
    return Object.keys(config.APP.GROUPED_AST).map(fileKey => {
      return {
        name: fileKey.substring(config.APP.name.length + 1).replace(/_/g, '/'),
        key: fileKey
      };
    });
  }
});
