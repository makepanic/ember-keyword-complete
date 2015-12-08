import Ember from 'ember';
import layout from '../templates/components/keyword-complete-tooltip-item';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['complete-item'],
  classNameBindings: ['active:complete-item-active'],
  active: false,
  suggestion: undefined,
  click(){
    this.sendAction('selected-item', this.get('suggestion'));
  }
});
