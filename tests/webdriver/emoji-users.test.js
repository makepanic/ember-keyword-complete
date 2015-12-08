var assert = require('assert');

var text;

describe('emoji-and-users', function () {
  it('it completes emojis and users', function () {
    return browser
      .url('/emoji-and-users')
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
      });
  });
});
