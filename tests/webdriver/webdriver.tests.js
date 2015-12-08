var assert = require('assert'),
  driver = require('./driver');

var client,
  text;

describe('ember-keyword-complete', function () {
  before(function(done){
    this.timeout(60 * 1000);
    client = driver();
    client.init().call(done);
  });

  after(function(done){
    client.end().call(done);
  });

  beforeEach(function(done) {
    this.timeout(60000); // some time is needed for the browser start up, on my system 3000 should work, too.
    // go back to start before each test
    client.url('http://localhost:7000')
      .call(done);
  });

  it('completes using a single datasource', function (done) {
    return client
      .click('#link-emoji')
      .waitForVisible('.emoji')
      .addValue('#complete-textarea', ':smil')
      .getText('.complete-tooltip', function (err, list) {
        assert.equal(list, '');
      })
      .addValue('#complete-textarea', ' :smil')
      .getText('.complete-tooltip li', function (err,  emojis) {
        assert.deepEqual(emojis, [':smile:', ':smiley:']);
      })
      .addValue('#complete-textarea', 'ey')
      .getText('.complete-tooltip li', function (err, emojis) {
        assert.deepEqual(emojis, ':smiley:');
      })
      .addValue('#complete-textarea', 'Back space')
      .getText('.complete-tooltip li', function (err, emojis) {
        assert.deepEqual(emojis, [':smile:', ':smiley:']);
      })
      .addValue('#complete-textarea', 'Space')
      .getText('.complete-tooltip', function (err, list) {
        assert.equal(list, '');
      })
      .addValue('#complete-textarea', ':s')
      .getText('.complete-tooltip', function (err, list) {
        assert.equal(list, '');
      })
      .addValue('#complete-textarea', 'm')
      .getText('.complete-tooltip li', function (err, emojis) {
        assert.deepEqual(emojis, [':smile:', ':smiley:']);
      })
      .addValue('#complete-textarea', ' :asds')
      .getText('.complete-tooltip', function (err, list) {
        assert.equal(list, '');
      })
      .call(done);
  });

  it('completes from multiple data sources by using a keyword identifier (@ vs :)', function (done) {
    return client
      .click('#link-emoji-and-users')
      .waitForVisible('.emoji-and-users')
      .getValue('#complete-textarea', function (err, value) {
        text = value;
      })
      .addValue('#complete-textarea', ' @ja')
      .pause(100)
      .getText('.complete-tooltip li strong', function (err, completions) {
        assert.deepEqual(completions, ['@Jaida62', '@Jalon1']);
      })
      .addValue('#complete-textarea', 'i')
      .pause(100)
      .getText('.complete-tooltip li strong', function (err, completions) {
        assert.deepEqual(completions, '@Jaida62');
      })
      .addValue('#complete-textarea', ' ')
      .pause(100)
      .getText('.complete-tooltip', function (err, list) {
        assert.equal(list, '');
      })
      .addValue('#complete-textarea', 'Back space')
      .addValue('#complete-textarea', 'Back space')
      .pause(100)
      .getText('.complete-tooltip li strong', function (err, completions) {
        assert.deepEqual(completions, ['@Jaida62', '@Jalon1']);
      })
      .addValue('#complete-textarea', 'Down arrow')
      .getText('.complete-tooltip .complete-item-active strong', function (err, active) {
        assert.deepEqual(active, '@Jaida62');
      })
      .addValue('#complete-textarea', 'Down arrow')
      .getText('.complete-tooltip .complete-item-active strong', function (err, active) {
        assert.deepEqual(active, '@Jalon1');
      })
      .addValue('#complete-textarea', 'Down arrow')
      .getText('.complete-tooltip .complete-item-active strong', function (err, active) {
        assert.deepEqual(active, '@Jaida62');
      })
      .addValue('#complete-textarea', 'Up arrow')
      .getText('.complete-tooltip .complete-item-active strong', function (err, active) {
        assert.deepEqual(active, '@Jalon1');
      })
      .addValue('#complete-textarea', 'Enter')
      .getText('.complete-tooltip', function (err, list) {
        assert.equal(list, '');
      })
      .getValue('#complete-textarea', function (err, value) {
        assert.equal(text + ' @Jalon1', value);
      })
      .call(done);
  });
});
