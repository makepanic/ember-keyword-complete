var assert = require('assert');

describe('emoji', function () {
  it('it shouldn\'t complete keyword without whitespace', function () {
    return browser
      .url('/emoji')
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
      });
  });
});
