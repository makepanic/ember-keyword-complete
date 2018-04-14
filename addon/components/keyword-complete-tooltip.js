import Component from '@ember/component';

export default Component.extend({
  classNames: ['complete-tooltip'],
  classNameBindings: ['visible::complete-tooltip--invisible']
});
