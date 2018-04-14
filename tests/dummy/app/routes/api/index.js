import config from 'dummy/config/environment';
import Route from '@ember/routing/route';

const name = 'ember-keyword-complete_addon_components_';

export default Route.extend({
  model(){
    return Object.keys(config.APP.GROUPED_AST).map(fileKey => {
      return {
        name: fileKey.substring(name.length).replace(/_/g, '/'),
        key: fileKey
      };
    });
  }
});
