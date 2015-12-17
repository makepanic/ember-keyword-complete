import Ember from 'ember';
import config from 'dummy/config/environment';

export default Ember.Route.extend({
  model({filename}){
    let items = config.APP.GROUPED_AST[filename];
    return {
      filename: items[0].meta.filename,
      path: items[0].meta.path,
      items
    };
  }
});
