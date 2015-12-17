/* jshint node: true */

var fs = require('fs'),
  path = require('path');

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dummy',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      AST: JSON.parse(fs.readFileSync(path.join(__dirname, 'ember-keyword-complete.ast.json'), {encoding: 'utf8'})),

      // Here you can pass flags/options to your application instance
      // when it is created
      EMOJIS: [{"val": "smile"}, {"val": "smiley"}, {"val": "grinning"}, {"val": "blush"}, {"val": "relaxed"}, {"val": "wink"}, {"val": "heart_eyes"}, {"val": "kissing_heart"}, {"val": "kissing_closed_eyes"}, {"val": "kissing"}, {"val": "kissing_smiling_eyes"}, {"val": "stuck_out_tongue_winking_eye"}, {"val": "stuck_out_tongue_closed_eyes"}, {"val": "stuck_out_tongue"}, {"val": "flushed"}, {"val": "grin"}, {"val": "pensive"}, {"val": "relieved"}, {"val": "unamused"}, {"val": "disappointed"}, {"val": "persevere"}, {"val": "cry"}, {"val": "joy"}, {"val": "sob"}, {"val": "sleepy"}],

      // JSON.stringify((new Array(20)).join(',').split(',').map(() => {return {nick: faker.internet.userName(), firstname: faker.name.firstName(), lastname: faker.name.lastName()}}))
      USERS: [{"nick":"Merlin40","firstname":"Dorcas","lastname":"Champlin"},{"nick":"Adele_Treutel75","firstname":"Nicklaus","lastname":"Marks"},{"nick":"Nicholaus_Strosin11","firstname":"Shawna","lastname":"Greenfelder"},{"nick":"Jaida62","firstname":"Eliane","lastname":"Lockman"},{"nick":"Emiliano.Glover","firstname":"Zechariah","lastname":"O'Kon"},{"nick":"Candace_Huel","firstname":"Delta","lastname":"Kulas"},{"nick":"Jalon1","firstname":"Timmothy","lastname":"Daugherty"},{"nick":"Gina_Hermiston","firstname":"Rosendo","lastname":"Bartell"},{"nick":"Mozell86","firstname":"Denis","lastname":"Spencer"},{"nick":"Tod_Moen91","firstname":"Lucio","lastname":"Brekke"},{"nick":"Lane.Lowe","firstname":"Talia","lastname":"Sipes"},{"nick":"Ida49","firstname":"Madie","lastname":"Cronin"},{"nick":"Wilber8","firstname":"Okey","lastname":"Stark"},{"nick":"Eryn.Kilback29","firstname":"Merle","lastname":"Leannon"},{"nick":"Consuelo71","firstname":"Jeramy","lastname":"Cummerata"},{"nick":"Whitney37","firstname":"Mckenna","lastname":"Gorczany"},{"nick":"Karson.Heller1","firstname":"Marianne","lastname":"Sauer"},{"nick":"Reilly_Crona","firstname":"Esmeralda","lastname":"Russel"},{"nick":"Marina77","firstname":"Kaci","lastname":"Pollich"},{"nick":"Clemens.Konopelski","firstname":"Aditya","lastname":"Cole"},{"nick":"Peggie98","firstname":"Damaris","lastname":"Littel"},{"nick":"Benedict_Smith80","firstname":"Carli","lastname":"Wilderman"},{"nick":"Luther.Pacocha","firstname":"Domingo","lastname":"Mann"},{"nick":"Joanie12","firstname":"Keenan","lastname":"Swaniawski"},{"nick":"Lottie86","firstname":"Estell","lastname":"Conn"},{"nick":"Antonetta.Little","firstname":"Nikki","lastname":"Schulist"},{"nick":"Marlin27","firstname":"Kaley","lastname":"Cruickshank"},{"nick":"Demond_Keebler","firstname":"Wilbert","lastname":"Haley"},{"nick":"Terence96","firstname":"Dedrick","lastname":"Donnelly"},{"nick":"Jon21","firstname":"Bill","lastname":"Runte"}]
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.baseURL = '/ember-keyword-complete';
  }

  return ENV;
};
