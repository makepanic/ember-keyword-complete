import Ember from 'ember';
import layout from '../templates/components/code-block-tabs';

export default Ember.Component.extend({
  layout: layout,

  current: 'result',

  tabs: ['result', 'javascript', 'template'],

  actions: {
    'active-tab'(tabKey) {
      this.set('current', tabKey);
    }
  }
});
