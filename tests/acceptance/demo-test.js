import {module, test} from 'qunit';
import {visit} from '@ember/test-helpers';
import {setupApplicationTest} from 'ember-qunit';
import {waitUntil, focus, find, keyEvent, click} from 'ember-native-dom-helpers';
import wait from 'ember-test-helpers/wait';
import {run} from '@ember/runloop';
import $ from 'jquery';

const CODES = {
  BackSpace: 8,
  Enter: 13,
  Down: 40,
  Up: 38
};

export function arrayFromList(nodes) {
  return Array.prototype.slice.call(nodes);
}

function type(element, text) {
  run(() => focus(element));
  text.split('').forEach((char) => {
    run(() => keyEvent(element, 'keydown', char.charCodeAt(0)));
    run(() => keyEvent(element, 'keypress', char.charCodeAt(0)));
    run(() => element.value += char);
    run(() => keyEvent(element, 'input', char.charCodeAt(0)));
    run(() => keyEvent(element, 'keyup', char.charCodeAt(0)));
  });
  return (window.wait || wait)();
}

// TYPE CODE
function typeCode(element, code) {
  run(() => focus(element));
  run(() => keyEvent(element, 'keydown', code));
  run(() => keyEvent(element, 'keyup', code));
  return (window.wait || wait)();
}

function typeBackSpace(element) {
  run(() => focus(element));
  run(() => keyEvent(element, 'keydown', CODES.BackSpace));
  run(() => element.value = element.value.substring(0, element.value.length - 1));
  run(() => keyEvent(element, 'input', CODES.BackSpace));
  run(() => keyEvent(element, 'keyup', CODES.BackSpace));
  return (window.wait || wait)();
}

module('Acceptance | demo', function (hooks) {
  setupApplicationTest(hooks);

  test('completes using single data source', async function (assert) {
    await visit('/demos/emoji');
    const textArea = find('#complete-textarea');
    await type(textArea, ':smil');
    assert.equal(find('.complete-tooltip-body ul').childElementCount, 0);

    await type(textArea, ' :smil');
    assert.deepEqual(
      arrayFromList(find('.complete-tooltip-body ul').children).map(li => li.innerText.trim().replace(/\n/g, '')),
      [':smile:', ':smiley:']
    );
    await type(textArea, 'ey');
    assert.deepEqual(
      arrayFromList(find('.complete-tooltip-body ul').children).map(li => li.innerText.trim().replace(/\n/g, '')),
      [':smiley:']
    );
    await typeBackSpace(textArea);
    assert.deepEqual(
      arrayFromList(find('.complete-tooltip-body ul').children).map(li => li.innerText.trim().replace(/\n/g, '')),
      [':smile:', ':smiley:']
    );
    await type(textArea, ' ');
    assert.equal(find('.complete-tooltip').style.display, 'none');
    await type(textArea, ' :s');
    assert.equal(find('.complete-tooltip').style.display, 'none');
    await type(textArea, 'm');
    assert.deepEqual(
      arrayFromList(find('.complete-tooltip-body ul').children).map(li => li.innerText.trim().replace(/\n/g, '')),
      [':smile:', ':smiley:']
    );
    await type(textArea, ' :asds');
    assert.equal(find('.complete-tooltip').style.display, 'none');
  });

  test('completes from multiple data sources by using a keyword identifier (@ vs :)', async function (assert) {
    await visit('/demos/emoji-and-users');

    const textArea = find('#complete-textarea');
    const text = textArea.value;
    await type(textArea, ' @ja');

    await waitUntil(() => find('.complete-tooltip-body ul').children.length === 2);

    assert.deepEqual(
      arrayFromList(find('.complete-tooltip-body ul').children).map(li => li.querySelector('strong').innerText.trim().replace(/\n/g, '')),
      ['@Jaida62', '@Jalon1']
    );

    await type(textArea, 'i');
    await waitUntil(() => find('.complete-tooltip-body ul').children.length === 1);
    assert.deepEqual(
      arrayFromList(find('.complete-tooltip-body ul').children).map(li => li.querySelector('strong').innerText.trim().replace(/\n/g, '')),
      ['@Jaida62']
    );
    await type(textArea, ' ');
    await waitUntil(() => find('.complete-tooltip').style.display === 'none');
    assert.equal(find('.complete-tooltip').style.display, 'none');
    await typeBackSpace(textArea);
    await typeBackSpace(textArea);
    assert.deepEqual(arrayFromList(find('.complete-tooltip-body ul').children).map(li => li.querySelector('strong').innerText.trim().replace(/\n/g, '')),
      ['@Jaida62', '@Jalon1']
    );
    await typeCode(textArea, CODES.Down);
    assert.deepEqual(
      find('.complete-tooltip .complete-item-active strong').innerText.trim().replace(/\n/g, ''),
      '@Jalon1'
    );
    await typeCode(textArea, CODES.Down);
    assert.deepEqual(
      find('.complete-tooltip .complete-item-active strong').innerText.trim().replace(/\n/g, ''),
      '@Jaida62'
    );
    await typeCode(textArea, CODES.Up);
    assert.deepEqual(
      find('.complete-tooltip .complete-item-active strong').innerText.trim().replace(/\n/g, ''),
      '@Jalon1'
    );
    await typeCode(textArea, CODES.Enter);
    assert.equal(find('.complete-tooltip').style.display, 'none');
    assert.equal(textArea.value, `${text} @Jalon1`);
  });

  test('handles moveCaret actions', async function (assert) {
    await visit('/demos/actions');

    const textArea = find('#complete-textarea');

    await click('#move-to-0');
    assert.equal(textArea.selectionStart, 0);

    await click('#move-to-5');
    assert.equal(textArea.selectionStart, 5);

    await click('#move-to-10');
    assert.equal(textArea.selectionStart, 10);
  });

  test('handles preselectValueAt action', async function (assert) {
    await visit('/demos/actions');

    const textArea = find('#complete-textarea-preselect');
    await type(textArea, ' :smi');

    await waitUntil(() => find('.complete-tooltip-body ul').children.length > 0);

    const $notActiveLi = $('.complete-tooltip-body ul li:not(.complete-item-active)');
    $notActiveLi.trigger('mouseenter');

    await waitUntil(() => $notActiveLi.hasClass('complete-item-active'));

    assert.ok($notActiveLi.hasClass('complete-item-active'));
  });

  test('handles refreshSuggestions action', async function (assert) {
    await visit('/demos/actions');

    const $button = $('#button--refreshSuggestions');
    const textArea = find('#complete-textarea-refresh');
    await type(textArea, ' #');

    await waitUntil(() => find('.complete-tooltip:not(.complete-tooltip--invisible) .complete-tooltip-body ul').children.length > 0);

    const initialLis = arrayFromList(find('.complete-tooltip:not(.complete-tooltip--invisible) .complete-tooltip-body ul').children)
      .map(li => li.innerText.trim().replace(/\n/g, ''));

    $button.trigger('mouseenter');

    await wait();

    const currentLis = arrayFromList(find('.complete-tooltip:not(.complete-tooltip--invisible) .complete-tooltip-body ul').children)
      .map(li => li.innerText.trim().replace(/\n/g, ''));

    assert.notEqual(initialLis.join('|'), currentLis.join('|'));
  });

});
