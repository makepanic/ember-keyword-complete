import config from 'dummy/config/environment';
import Route from '@ember/routing/route';

export default Route.extend({
  model({filename}){
    let module;
    const items = [];

    config.APP.GROUPED_AST[filename].forEach(item => {
      if (item.kind === 'module') {
        module = item;
      } else {
        items.push(item);
      }
    });

    return {
      module: module,
      filename: items[0].meta.filename,
      path: items[0].meta.path,
      items
    };
  }
});
