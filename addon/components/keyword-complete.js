import Ember from 'ember';
import layout from '../templates/components/keyword-complete';

const {observer, computed, run, assert, K, $} = Ember;

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
   * @property minQueryLength
   * @type Number
   * @default 2
   * @public
   */
  minQueryLength: 2,

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

  suggestions: [],
  keywordRegex: REGEX_KEYWORDS,
  currentSourceKey: null,

  _keyPressHandler: K,
  _keyDownHandler: K,
  _tooltipCloseHandler: K,
  _loadSuggestionsId: -1,

  /**
   * Computed property that represents the current keyword suggestion query.
   * @property filterQuery
   * @type String
   * @default ''
   * @example '@embe'
   * @private
   */
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

  /**
   * Computed property that represents whether the completion suggestion tooltip should be visible
   * @property tooltipVisible
   * @type boolean
   * @default false
   * @private
   */
  tooltipVisible: computed('filterQuery.length', 'minQueryLength', 'suggestions.length', function () {
    return !!(
      this.get('filterQuery.length') > this.get('minQueryLength') &&
      this.get('suggestions.length') > 0
    );
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
  },

  /**
   * Function that is called to select a datasource item
   * @param {*} selectedItem
   * @public
     */
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
    let sources = this.get('dataSources'),
      input = this.get('input'),
      $input = this.get('$input'),
      caretPosition = getCaretPosition(input),
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
        this.set('selectionIdx', 0);
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
  },

  /**
   * Function called on target 'keydown'. Used to handle "special" key presses.
   * @param {jQuery.Event} ev
   * @returns {boolean|undefined}
   * @public
     */
  keyDownHandler(ev) {
    let input = this.get('input'),
      sources = this.get('dataSources');

    let visible = this.get('tooltipVisible');
    if (ev.ctrlKey || ev.altKey || ev.metaKey || ev.which === KEYS.SHIFT) {
      return;
    }

    if (ev.which === KEYS.ESC) {
      this.closeTooltip();
      return;
    }

    if (this.get('caretPosition') < this.get('caretStart')) {
      this.closeTooltip();
      return false;
    }

    if (this.get('caretStart') === null && ev.which === KEYS.BACKSPACE) {
      // see if the previous keyword could be an autocomplete keyword
      let position = getCaretPosition(input) - 1,
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
        if (visible && selectionIdx > -1) {
          this.applySelection(this.get('suggestions')[selectionIdx]);
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
          this.decrementProperty('selectionIdx');
        } else {
          this.set('selectionIdx', this.get('suggestions.length') - 1);
        }
        return false;
      case KEYS.ARROW_DOWN:
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
      case KEYS.BACKSPACE:
        let caretPosition = getCaretPosition(input) - 1,
          prevChar = input.value[caretPosition - 1];
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
  },

  didInsertElement: function () {
    this._super(...arguments);

    let target = this.get('target'),
      $tooltip,
      $input,
      input;

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
    }
  }
});
