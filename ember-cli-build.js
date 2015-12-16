/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  var app = new EmberAddon(defaults, {
    // Add options here
    'ember-prism': {
      //'theme': 'default',
      'components': ['bash', 'handlebars', 'javascript']
    }
  });

  /*
   This build file specifes the options for the dummy test app of this
   addon, located in `/tests/dummy`
   This build file does *not* influence how the addon or the app using it
   behave. You most likely want to be modifying `./index.js` or app's build file
   */
  app.import(app.bowerDirectory + '/ember/ember-template-compiler.js');

  if (app.env !== 'production') {
    //app.import(app.bowerDirectory + '/keysim.js/dist/keysim.js', {type: 'test'});
  }

  return app.toTree();
};
