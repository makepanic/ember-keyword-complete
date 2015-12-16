import Ember from 'ember';
import layout from '../templates/components/keyword-complete';

const {observer, computed, run, assert, K} = Ember;

const REGEX_WHITESPACE = /[\s\t]/,
  REGEX_KEYWORDS = /[0-9a-zA-Z_\.]/,
  KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    ESC: 27,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40
  };

function setCaretPosition(element, caretPosition) {
  element.focus();
  element.setSelectionRange(caretPosition, caretPosition);
}
function getCaretPosition(el) {
  return el.selectionStart;
}

export default Ember.Component.extend({
  layout: layout,

  keyPressHandler: K,
  keyDownHandler: K,

  classNames: ['auto-complete'],
  selectionIdx: -1,
  target: '',
  text: '',
  filterQuery: computed('text', 'caretStart', 'caretEnd', function () {
    let query = '',
      text = this.get('text'),
      start = this.get('caretStart'),
      end = this.get('caretEnd');

    if (start !== null) {
      if (end !== null) {
        query = text.substring(start, end);
      } else {
        query = text.substring(start, this.get('caretPosition'));
      }
    }
    return query;
  }),

  minQueryLength: 2,
  caretPosition: 0,
  caretStart: null,
  caretEnd: null,
  loadDebounceInterval: 300,

  keywordRegex: REGEX_KEYWORDS,

  currentSourceKey: null,
  keyItemComponent: computed('currentSourceKey', function () {
    let currentSourceKey = this.get('currentSourceKey');
    return currentSourceKey ? this.get('dataSources')[currentSourceKey].component : undefined;
  }),
  dataSources: {},
  suggestions: [],
  _loadSuggestionsId: -1,

  setSuggestions(filterQuery, currentSourceKey) {
    let loadSuggestionsId = this.get('_loadSuggestionsId') + 1;
    this.set('_loadSuggestionsId', loadSuggestionsId);
    this.get('dataSources')[currentSourceKey].loadSuggestions(filterQuery).then(data => {
      if (this.get('_loadSuggestionsId') === loadSuggestionsId) {
        this.set('suggestions', data);
        this.set('selectionIdx', 0);
      } // else ignore because newer load promise already started
    });
  },

  updateSuggestions: observer('filterQuery', 'currentSourceKey', function () {
    let filterQuery = this.get('filterQuery'),
      currentSourceKey = this.get('currentSourceKey');

    if (currentSourceKey && filterQuery.length > this.get('minQueryLength')) {
      // TODO: lodash debounce trailing + leading
      this.setSuggestions(filterQuery, currentSourceKey);
    }
  }),

  tooltipVisible: computed('filterQuery.length', 'minQueryLength', 'suggestions.length', function () {
    return !!(
      this.get('filterQuery.length') > this.get('minQueryLength') &&
      this.get('suggestions.length') > 0
    );
  }),

  closeTooltip(){
    this.get('suggestions').splice(0, this.get('suggestions.length'));
    this.set('selectionIdx', -1);
    this.set('currentSourceKey', null);
    this.set('caretStart', null);
    this.set('caretEnd', null);
  },

  applySelection(selectedItem){
    let start = this.get('caretStart'),
      caretPosition = this.get('caretPosition'),
      text = this.get('text'),
      filterQuery = this.get('filterQuery'),
      selectionString = this.get('dataSources')[this.get('currentSourceKey')]
        .extractDataString(selectedItem);

    if (start === null) {
      start = caretPosition;
    }

    let before = text.substring(0, start),
      after = text.substring(start + filterQuery.length);

    this.set('text', `${before}${selectionString}${after}`);
    this.closeTooltip();

    run.scheduleOnce('afterRender', this, () => {
      setCaretPosition(this.get('input'), start + selectionString.length);
    });
  },

  willDestroyElement: function(){
    this._super(...arguments);

    this.get('$input')
      .off('keypress', this.get('keyPressHandler'))
      .off('keydown', this.get('keyDownHandler'));
  },

  didInsertElement: function () {
    this._super(...arguments);
    let target = this.get('target'),
      $input,
      input,
      that = this,
      sources = this.get('dataSources');

    assert('keyword-complete needs a valid target element', target.length);

    $input = this.$(target);
    input = $input[0];

    this.set('$input', $input);
    this.set('input', input);

    function keyPressHandler(ev) {
      let caretPosition = getCaretPosition(input),
        text = $input.val(),
        prevChar = text.charAt(caretPosition - 1),
        currentChar = String.fromCharCode(ev.which);

      if (sources.hasOwnProperty(currentChar)) {
        // start of keyword autocomplete
        if (!prevChar || REGEX_WHITESPACE.test(prevChar)) {
          that.set('currentSourceKey', currentChar);
          that.set('caretStart', caretPosition);
          that.set('caretEnd', null);
          that.get('suggestions').splice(0, that.get('suggestions.length'));
          that.set('selectionIdx', 0);
        }
      } else if (that.get('caretStart') !== null) {
        if (REGEX_WHITESPACE.test(currentChar)) {
          // ended because of whitespace
          that.closeTooltip();
        } else {
          that.set('caretEnd', null);
        }
      }
      that.set('caretPosition', caretPosition + 1);
    }

    function keyDownHandler(ev) {
      let visible = that.get('tooltipVisible');
      if (ev.ctrlKey || ev.altKey || ev.metaKey || ev.which === KEYS.SHIFT) {
        return;
      }

      if (ev.which === KEYS.ESC) {
        that.closeTooltip();
        return;
      }

      if (that.get('caretPosition') < that.get('caretStart')) {
        that.closeTooltip();
        return false;
      }

      if (that.get('caretStart') === null && ev.which === KEYS.BACKSPACE) {
        // see if the previous keyword could be an autocomplete keyword
        let position = getCaretPosition(input) - 1,
          prevChar = '',
          prevCharOk = true;

        that.set('caretPosition', position);

        while (prevCharOk && position >= 0) {
          position -= 1;
          prevChar = input.value[position];

          if (sources.hasOwnProperty(prevChar)) {
            that.set('currentSourceKey', prevChar);
            prevChar = input.value[position - 1];
            if (!prevChar || REGEX_WHITESPACE.test(prevChar)) {
              that.set('caretStart', position);
              break;
            }
          }

          prevCharOk = that.get('keywordRegex').test(prevChar);
        }
      }

      let selectionIdx = that.get('selectionIdx');
      switch (ev.which) {
        case KEYS.ENTER:
        case KEYS.TAB:
          if (selectionIdx > -1) {
            that.applySelection(that.get('suggestions')[selectionIdx]);
          } else {
            return true;
          }
          ev.stopImmediatePropagation();
          return false;
        case KEYS.ARROW_UP:
          if (!visible) {
            return;
          }
          if (selectionIdx - 1 > -1) {
            that.decrementProperty('selectionIdx');
          } else {
            that.set('selectionIdx', that.get('suggestions.length') - 1);
          }
          return false;
        case KEYS.ARROW_DOWN:
          if (!visible) {
            return;
          }
          if (selectionIdx + 1 < that.get('suggestions.length')) {
            that.incrementProperty('selectionIdx');
          } else {
            // next round
            that.set('selectionIdx', 0);
          }
          return false;
        case KEYS.BACKSPACE:
          let caretPosition = getCaretPosition(input) - 1,
            prevChar = input.value[caretPosition - 1];
          that.set('caretPosition', caretPosition);
          that.set('selectionIdx', 0);

          if (REGEX_WHITESPACE.test(prevChar)) {
            that.set('caretStart', null);
            that.set('caretEnd', null);
          }

          if (that.get('caretStart') !== null) {
            that.set('caretEnd', caretPosition);
          }

          if (caretPosition === 0) {
            that.closeTooltip();
          }
          break;
      }
    }

    $input
      .on('keypress', keyPressHandler)
      .on('keydown', keyDownHandler);

    this.set('keyPressHandler', keyPressHandler);
    this.set('keyDownHandler', keyDownHandler);
  },

  actions: {
    clickedSelection(value){
      this.applySelection(value);
    }
  }
});
