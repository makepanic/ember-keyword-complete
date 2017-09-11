import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['complete-tooltip'],
  classNameBindings: ['visible::complete-tooltip--invisible']
});
