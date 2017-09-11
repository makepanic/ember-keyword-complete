import Ember from 'ember';
import layout from '../templates/components/keyword-complete';

const {observer, computed, run, assert, $} = Ember;

const REGEX_WHITESPACE = /[\s\t]/;
const REGEX_KEYWORDS = /[0-9a-zA-Z_\.]/;
const KEYS = {
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

/**
 * Function to set the caret position for a given element.
 * @param {HTMLInputElement|HTMLTextAreaElement} element
 * @param {Number} caretPosition
 */
function setCaretPosition(element, caretPosition) {
  element.focus();
  element.setSelectionRange(caretPosition, caretPosition);
}
/**
 * Function to read the current caret position for a given element
 * @param {HTMLInputElement|HTMLTextAreaElement} el
 * @returns {Number}
 */
function getCaretPosition(el) {
  return el.selectionStart;
}

/**
 * Input/Textarea wrapping component that adds listeners for keyboard interaction and yields data.
 *
 * @class KeywordComplete
 * @module ember-keyword-complete/components/keyword-complete
 * @extends Ember.Component
 * @public
 */
export default Ember.Component.extend({
  /**
   * Async suggestion loading debounce interval.
   * @property loadDebounceInterval
   * @type Number
   * @default 300
   * @public
   */
  loadDebounceInterval: 300,

  /**
   * Minimum query length before suggestion loading is triggered.
   * This values can be overwritten on a per data-source basis, by setting `minQueryLength` for a data source.
   * @property minQueryLength
   * @type Number
   * @default 2
   * @public
   */
  minQueryLength: 0,

  /**
   * Object that represents all available data sources for the keyword completion.
   * The datasource value object must contain a method to extract a string from a given suggestion.
   * This `extractDataString(suggestion)` will be used once an suggestion was chosen to be used.
   * In addition a `loadSuggestion(query)` must be present that returns a promise that resolves
   * an array of suggestion for the passed `query` string.
   * An additional `component` property can be set that is later used in the `keyword-complete-tooltip-item`
   * if the component is not in block form.
   * @property dataSources
   * @type Object
   * @default {}
   * @public
   * @example
   * component.set('dataSources', {
   *  '@': {
   *     component: 'user-item',
   *     extractDataString(item) {
   *       return `@${item.nick}`;
   *     },
   *     loadSuggestions(query) {
   *       const queryLower = query.substring(1).toLowerCase();
   *       return RSVP.resolve(ENV.APP.USERS.filter(item => item.nick.toLowerCase().startsWith(queryLower)));
   *     }
   *  }
   * });
   */
  dataSources: {},

  /**
   * Autocompletion target text (usually same value as the target value).
   * @property text
   * @type String
   * @default ''
   * @public
   */
  text: '',

  /**
   * Target element selector (Should select an input or textarea).
   * @property target
   * @type String
   * @default ''
   * @example '#message-textarea'
   * @public
   */
  target: '',

  // layout fields
  layout: layout,
  classNames: ['auto-complete'],

  // private values (shouldn't be changed externally)
  caretPosition: 0,
  caretStart: null,
  caretEnd: null,
  selectionIdx: -1,
  breakOnSpaces: true,

  suggestions: [],
  keywordRegex: REGEX_KEYWORDS,
  currentSourceKey: null,

  _keyPressHandler() {
  },
  _keyDownHandler() {
  },
  _tooltipCloseHandler() {
  },
  _loadSuggestionsId: -1,
  shouldShowTypingState: false,
  showTypingState: false,
  typingStateTimeout: 2000,
  errors: [],
  enabled: true,

  /**
   * Computed property that represents the current keyword suggestion query.
   * @property filterQuery
   * @type String
   * @default ''
   * @example '@embe'
   * @private
   */
  filterQuery: computed('text', 'caretStart', 'caretEnd', function () {
    let query = '';
    const text = this.get('text') || '';
    const start = this.get('caretStart');
    const end = this.get('caretEnd');

    if (start !== null) {
      if (end !== null) {
        query = text.substring(start, end);
      } else {
        query = text.substring(start, this.get('caretPosition'));
      }
    }
    return query;
  }),

  /**
   * Component name for the currently active datasource
   * @type String
   * @property keyItemComponent
   * @public
   */
  keyItemComponent: computed('currentSourceKey', function () {
    let currentSourceKey = this.get('currentSourceKey');
    return currentSourceKey ? this.get('dataSources')[currentSourceKey].component : undefined;
  }),

  keyItemClassName: computed('currentSourceKey', function () {
    let currentSourceKey = this.get('currentSourceKey');
    return currentSourceKey ? this.get('dataSources')[currentSourceKey].itemClassName : undefined;
  }),

  /**
   * Function to trigger suggestion loading by passing a filter query and the current source key
   * @param {String} filterQuery
   * @param {String} currentSourceKey
   * @example
   * component.setSuggestions('ember', '@');
   */
  setSuggestions(filterQuery, currentSourceKey) {
    let loadSuggestionsId = this.get('_loadSuggestionsId') + 1;
    this.set('_loadSuggestionsId', loadSuggestionsId);
    this.set('isLoadingSuggestions', true);
    this.get('dataSources')[currentSourceKey].loadSuggestions(filterQuery).then((data) => {
      if (this.get('_loadSuggestionsId') === loadSuggestionsId) {
        this.set('errors', []);
        this.set('suggestions', data);
        this.set('selectionIdx', 0);
      } // else ignore because newer load promise already started
    }).catch((errors) => {
      if (this.get('_loadSuggestionsId') === loadSuggestionsId) {
        this.set('errors', Array.isArray(errors) ? errors : [errors]);
      }
    }).finally(() => {
      if (this.get('_loadSuggestionsId') === loadSuggestionsId) {
        this.set('isLoadingSuggestions', false);
      }
    });
  },

  debounceThis: observer('filterQuery', 'currentSourceKey', function () {
    const filterQuery = this.get('filterQuery');
    const timeout = this.get('loadDebounceInterval');
    const currentSourceKey = this.get('currentSourceKey')
    this.set('errors', []);

    if (filterQuery && currentSourceKey && filterQuery.length > this.get('currentMinQueryLength')) {
      if (this.get('shouldShowTypingState')) {
        this.set('showTypingState', true);
        this.get('suggestions').splice(0, this.get('suggestions.length'));
        this.set('isLoadingSuggestions', false);
      } else {
        this.get('suggestions').splice(0, this.get('suggestions.length'));
      }
    }

    Ember.run.debounce(this, this.updateSuggestions, timeout || 300);
  }),

  updateSuggestions: function () {
    const filterQuery = this.get('filterQuery');
    const currentSourceKey = this.get('currentSourceKey');

    this.set('showTypingState', false);
    if (currentSourceKey && filterQuery.length > this.get('currentMinQueryLength')) {
      this.setSuggestions(filterQuery, currentSourceKey);
    }
  },

  /**
   * Computed property that represents whether the completion suggestion tooltip should be visible
   * @property tooltipVisible
   * @type boolean
   * @default false
   * @private
   */
  tooltipVisible: computed('filterQuery.length', 'currentMinQueryLength', 'suggestions.length', 'showTypingState', 'isLoadingSuggestions', function () {
    return (
      (this.get('filterQuery.length') > this.get('currentMinQueryLength') && this.get('suggestions.length') > 0) || this.get('showTypingState') || this.get('isLoadingSuggestions') || this.get('errors.length') > 0
    );
  }),

  currentMinQueryLength: computed('minQueryLength', 'currentSourceKey', function () {
    const currentSourceKey = this.get('currentSourceKey');
    let minQueryLength = this.get('minQueryLength');

    if (currentSourceKey && this.get('dataSources')[currentSourceKey]) {
      const ds = this.get('dataSources')[currentSourceKey];
      minQueryLength = ds.hasOwnProperty('minQueryLength') ? ds.minQueryLength : minQueryLength;
    }

    return minQueryLength;
  }),

  /**
   * Function to close the completion suggestion tooltip
   * @property tooltipVisible
   * @type Function
   * @public
   * @returns {void}
   */
  closeTooltip(){
    this.get('suggestions').splice(0, this.get('suggestions.length'));
    this.set('selectionIdx', -1);
    this.set('currentSourceKey', null);
    this.set('caretStart', null);
    this.set('caretEnd', null);
    this.sendAction('onClose');
  },

  /**
   * Function that is called to select a datasource item
   * @param {*} selectedItem
   * @public
   */
  applySelection(selectedItem){
    let start = this.get('caretStart');
    const caretPosition = this.get('caretPosition');
    const text = this.get('text');
    const filterQuery = this.get('filterQuery');
    const selectionString = this.get('dataSources')[this.get('currentSourceKey')]
      .extractDataString(selectedItem);

    if (start === null) {
      start = caretPosition;
    }

    const before = text.substring(0, start);
    const after = text.substring(start + filterQuery.length);

    this.set('text', `${before}${selectionString}${after}`);
    this.closeTooltip();

    run.scheduleOnce('afterRender', this, () => {
      setCaretPosition(this.get('input'), start + selectionString.length);
    });
  },

  willDestroyElement: function () {
    this._super(...arguments);

    this.get('$input')
      .off('keypress', this.get('_keyPressHandler'))
      .off('keydown', this.get('_keyDownHandler'));

    $(document)
      .off('click', this.get('_tooltipCloseHandler'));
  },

  /**
   * Function called on document 'click'. Used to close the completion tooltip.
   * @param {jQuery.Event} ev
   * @public
   */
  documentClickHandler(ev) {
    let $tooltip = this.get('$tooltip');
    if (
      this.get('tooltipVisible') && !$tooltip.is(ev.target) &&
      $tooltip.has(ev.target).length === 0
    ) {
      this.closeTooltip();
    }
  },

  /**
   * Function called on target 'keypress'. Used to detect the start of a keyword completion.
   * @param {jQuery.Event} ev
   * @returns {void}
   * @public
   */
  keyPressHandler(ev) {
    if (!this.get('enabled')) {
      return;
    }

    const sources = this.get('dataSources');
    const input = this.get('input');
    const $input = this.get('$input');
    const caretPosition = getCaretPosition(input);
    const text = $input.val();
    const prevChar = text.charAt(caretPosition - 1);
    const currentChar = String.fromCharCode(ev.which || ev.keyCode);
    const breakOnSpaces = this.get('breakOnSpaces');

    if (sources.hasOwnProperty(currentChar)) {
      // start of keyword autocomplete

      if (!prevChar || REGEX_WHITESPACE.test(prevChar)) {
        this.set('currentSourceKey', currentChar);
        this.set('caretStart', caretPosition);
        this.set('caretEnd', null);
        this.get('suggestions').splice(0, this.get('suggestions.length'));
        this.set('selectionIdx', 0);
        this.set('errors', []);
      }
    } else if (this.get('caretStart') !== null) {
      if (breakOnSpaces && REGEX_WHITESPACE.test(currentChar)) {
        // ended because of whitespace
        this.closeTooltip();
      }
      else {
        this.set('caretEnd', null);
      }
    }
    this.set('caretPosition', caretPosition + 1);
  },

    /**
     * Function called on target 'keydown'. Used to handle "special" key presses.
     * @param {jQuery.Event} ev
     * @returns {boolean|undefined}
     * @public
     */
    keyDownHandler(ev) {
        if (!this.get('enabled')) {
      return;
    }

    const input = this.get('input');
           const sources = this.get('dataSources');const keyCode = ev.which || ev.keyCode;

    let visible = this.get('tooltipVisible');
    if (ev.ctrlKey || ev.altKey || ev.metaKey || ev.shiftKey || keyCode === KEYS.SHIFT) {
      return;
    }

    if (keyCode === KEYS.ESC) {
      this.closeTooltip();
      return;
    }

    if (this.get('caretPosition') < this.get('caretStart')) {
      this.closeTooltip();
      return;
    }

    if (this.get('caretStart') === null && keyCode === KEYS.BACKSPACE) {
      // see if the previous keyword could be an autocomplete keyword
      let position = getCaretPosition(input) - 1;
      let prevChar = '';
      let prevCharOk = true;

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

        if (visible && this.get('shouldShowTypingState')) {
            this.set('showTypingState', true);
            Ember.run.later(this, ()=> {
                this.set('showTypingState', false);
            }, this.get('typingStateTimeout'));
        }let selectionIdx = this.get('selectionIdx');
        switch (keyCode) {
            case KEYS.ENTER:
            case KEYS.TAB:{
                if (visible && selectionIdx > -1) {
                    this.applySelection(this.get('suggestions')[selectionIdx]);
                } else {
                    return true;
                }
                ev.stopImmediatePropagation();
                return false;
      }      case KEYS.ARROW_UP:{
                if (!visible) {
                    return;
                }
                if (selectionIdx - 1 > -1) {
                    this.decrementProperty('selectionIdx');
                } else {
                    this.set('selectionIdx', this.get('suggestions.length') - 1);
                }
                return false;
      }      case KEYS.ARROW_DOWN:{
                if (!visible) {
                    return;
                }
                if (selectionIdx + 1 < this.get('suggestions.length')) {
                    this.incrementProperty('selectionIdx');
                } else {
                    // next round
                    this.set('selectionIdx', 0);
                }
                return false;
      }      case KEYS.BACKSPACE:{
                const caretPosition = getCaretPosition(input) - 1;
                   const prevChar = input.value[caretPosition - 1];
                this.set('caretPosition', caretPosition);
                this.set('selectionIdx', 0);

        if (REGEX_WHITESPACE.test(prevChar)) {
          this.set('caretStart', null);
          this.set('caretEnd', null);
        }

        if (this.get('caretStart') !== null) {
          this.set('caretEnd', caretPosition);
        }

        if (caretPosition === 0) {
          this.closeTooltip();
        }
        break;
      }
    }
  },

  didInsertElement: function () {
    this._super(...arguments);

    const target = this.get('target');
    let $tooltip;
    let $input;
    let input;

    assert('keyword-complete needs a valid target element', target.length);

    $input = this.$(target);
    input = $input[0];
    $tooltip = this.$(`#${this.get('elementId')}-tooltip`);

    this.set('$tooltip', $tooltip);
    this.set('$input', $input);
    this.set('input', input);

    this.set('_tooltipCloseHandler', (...evArgs) => this.documentClickHandler(...evArgs));
    this.set('_keyPressHandler', (...evArgs) => this.keyPressHandler(...evArgs));
    this.set('_keyDownHandler', (...evArgs) => this.keyDownHandler(...evArgs));

    $input
      .on('keypress', this.get('_keyPressHandler'))
      .on('keydown', this.get('_keyDownHandler'));
    $(document)
      .on('click', this.get('_tooltipCloseHandler'));

  },

  actions: {
    clickedSelection(value){
      this.applySelection(value);
    },
    hoverSelection(index){
      this.set('selectionIdx', index);
    },
    refreshSuggestions(){
      this.updateSuggestions();
    },
    setCaretPositionAction(position){
      this.setCaretPosition(this.get('input'), position);
    }
  }
});
