import Ember from 'ember';
import layout from '../templates/components/keyword-complete-tooltip-item';

export default Ember.Component.extend({
  /**
   * Flag that represents whether the item is active.
   * @property active
   * @type boolean
   * @default false
   * @public
   */
  active: false,

  layout: layout,
  classNames: ['complete-item'],
  classNameBindings: ['active:complete-item-active'],

  suggestion: undefined,
  click(){
    this.sendAction('selected-item', this.get('suggestion'));
  }
});
