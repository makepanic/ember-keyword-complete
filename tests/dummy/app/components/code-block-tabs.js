import Component from '@ember/component';
import layout from '../templates/components/code-block-tabs';

export default Component.extend({
  layout,

  current: 'result',

  tabs: ['result', 'javascript', 'template'],

  actions: {
    'active-tab'(tabKey) {
      this.set('current', tabKey);
    }
  }
});
