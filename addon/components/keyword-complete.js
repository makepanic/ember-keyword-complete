import Ember from 'ember';
import layout from '../templates/components/keyword-complete';

const {observer, computed, run, assert} = Ember;

const REGEX_WHITESPACE = /[\s\t]/,
  REGEX_KEYWORDS = /[0-9a-zA-Z_\.]/,
  KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    LEFT_WINDOWS: 91,
    RIGHT_WINDOWS: 92,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    INSERT: 45,
    DELETE: 46,
    ZERO: 48,
    A: 65,
    Z: 90
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
  keyItemComponent: computed('currentSourceKey', function(){
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

  didInsertElement: function () {
    this._super(...arguments);
    let target = this.get('target'),
      $input,
      input,
      sources = this.get('dataSources');

    assert('keyword-complete needs a valid target element', target.length);

    $input = this.$(target);
    input = $input[0];

    this.set('$input', $input);
    this.set('input', input);

    $input.on('keypress', (ev) => {
      let caretPosition = getCaretPosition(input),
        text = $input.val(),
        prevChar = text.charAt(caretPosition - 1),
        currentChar = String.fromCharCode(ev.which);

      if (sources.hasOwnProperty(currentChar)) {
        // start of keyword autocomplete
        if (!prevChar || REGEX_WHITESPACE.test(prevChar)) {
          this.set('currentSourceKey', currentChar);
          this.set('caretStart', caretPosition);
          this.set('caretEnd', null);
          this.get('suggestions').splice(0, this.get('suggestions.length'));
        }
      } else if (this.get('caretStart') !== null) {
        if (REGEX_WHITESPACE.test(currentChar)) {
          // ended because of whitespace
          this.closeTooltip();
        } else {
          this.set('caretEnd', null);
        }
      }

      this.set('caretPosition', caretPosition + 1);
    });

    $input.on('keydown', (ev) => {
      let visible = this.get('tooltipVisible');
      if (ev.ctrlKey || ev.altKey || ev.metaKey || ev.which === KEYS.SHIFT) {
        return;
      }

      if (ev.which === KEYS.ESC) {
        this.set('selectionIdx', -1);
        this.closeTooltip();
        return;
      }

      if (this.get('caretPosition') < this.get('caretStart')) {
        this.closeTooltip();
        return false;
      }

      if (this.get('caretStart') === null && ev.which === KEYS.BACKSPACE) {
        // see if he previous keyword could be an autocomplete keyword
        let position = getCaretPosition(input),
          prevChar = '',
          prevCharOk = true;

        this.set('caretPosition', position);

        while (prevCharOk && position >= 0) {
          position -= 1;
          prevChar = input.value[position];

          if (sources.hasOwnProperty(prevChar)) {
            this.set('currentSourceKey', prevChar);
            prevChar = input.value[position - 1];
            if (!prevChar || REGEX_WHITESPACE.test(prevChar)) {
              this.set('caretStart', position);
              break;
            }
          }

          prevCharOk = this.get('keywordRegex').test(prevChar);
        }
      }

      let selectionIdx = this.get('selectionIdx');
      switch (ev.which) {
        case KEYS.ENTER:
        case KEYS.TAB:
          if (selectionIdx > -1) {
            this.applySelection(this.get('suggestions')[selectionIdx]);
          } else {
            return true;
          }
          ev.stopImmediatePropagation();
          return false;
        case KEYS.ARROW_UP:
          if (!visible) { return; }
          if (selectionIdx - 1 > -1) {
            this.decrementProperty('selectionIdx');
          } else {
            this.set('selectionIdx', this.get('suggestions.length') - 1);
          }
          return false;
        case KEYS.ARROW_DOWN:
          if (!visible) { return; }
          if (selectionIdx + 1 < this.get('suggestions.length')) {
            this.incrementProperty('selectionIdx');
          } else {
            // next round
            this.set('selectionIdx', 0);
          }
          return false;
        case KEYS.BACKSPACE:
          let caretPosition = getCaretPosition(input);
          this.set('caretPosition', caretPosition);
          this.set('selectionIdx', -1);
          if (this.get('caretStart') !== null) {
            this.set('caretEnd', caretPosition - 1);
          }

          if (caretPosition === 0) {
            this.closeTooltip();
          }
          break;
      }
    });
  },

  actions: {
    clickedSelection(value){
      this.applySelection(value);
    }
  }
});
