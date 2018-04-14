import Component from '@ember/component';
import layout from '../templates/components/keyword-complete-tooltip-item';

export default Component.extend({
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
    this.get('selectValue')(this.get('suggestion'));
  }
});
