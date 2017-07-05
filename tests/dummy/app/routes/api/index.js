import Ember from 'ember';
import config from 'dummy/config/environment';

const name = 'ember-keyword-complete_addon_components_';

export default Ember.Route.extend({
  model(){
    return Object.keys(config.APP.GROUPED_AST).map(fileKey => {
      return {
        name: fileKey.substring(name.length).replace(/_/g, '/'),
        key: fileKey
      };
    });
  }
});
