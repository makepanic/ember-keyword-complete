/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
    'ember-prism': {
      //'theme': 'default',
      'components': ['bash', 'handlebars', 'javascript']
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
  app.import(app.bowerDirectory + '/emojione/lib/js/emojione.js');
  app.import(app.bowerDirectory + '/emojione/assets/css/emojione.min.css');
  app.import(app.bowerDirectory + '/emojione/assets/sprites/emojione.sprites.css');
  app.import(app.bowerDirectory + '/emojione/assets/sprites/emojione.sprites.png', {destDir: 'assets/img'});

  return app.toTree();
};
