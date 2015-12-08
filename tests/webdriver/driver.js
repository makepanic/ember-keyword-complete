var webdriverio = require('webdriverio');

module.exports = function () {
  var options;
  if (process.env.TRAVIS === 'true') {
    console.log('is travis');
    options = {
      desiredCapabilities: {
        browserName: process.env.CAP_BROWSER,
        version: process.env.CAP_VERSION,
        platform: process.env.CAP_PLATFORM,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        name: process.env.CAP_NAME,
        build: process.env.TRAVIS_BUILD_NUMBER
      },
      host: 'localhost',
      port: 4445,
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY,
      logLevel: 'verbose'
    };
  } else {
    console.log('isnt travis');
    options = {
      desiredCapabilities: {
        browserName: 'chrome'
      },
      //
      // ===================
      // Test Configurations
      // ===================
      // Define all options that are relevant for the WebdriverIO instance here
      //
      // Level of logging verbosity: silent | verbose | command | data | result | error
      logLevel: 'error',
      //
      // Enables colors for log output.
      coloredLogs: true,
      //
      // Saves a screenshot to a given path if a command fails.
      screenshotPath: './tests/webdriver/scrots/',
      //
      // Set a base URL in order to shorten url command calls. If your url parameter starts
      // with "/", the base url gets prepended.
      baseUrl: 'http://localhost:7000',
      //
      // Default timeout for all waitForXXX commands.
      waitforTimeout: 100000
    };
  }

  return webdriverio.remote(options);
};
