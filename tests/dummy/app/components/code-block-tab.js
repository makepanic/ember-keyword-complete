import Component from '@ember/component';
import layout from '../templates/components/code-block-tab';
import {computed} from '@ember/object';

export default Component.extend({
  layout,

  current: undefined,
  isVisible: computed('current', 'name', function(){
    return this.get('current') === this.get('name');
  })
});
