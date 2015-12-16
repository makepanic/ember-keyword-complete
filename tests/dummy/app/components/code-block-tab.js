import Ember from 'ember';
import layout from '../templates/components/code-block-tab';

const {computed} = Ember;

export default Ember.Component.extend({
  layout: layout,

  current: undefined,
  isVisible: computed('current', 'name', function(){
    return this.get('current') === this.get('name');
  })
});
