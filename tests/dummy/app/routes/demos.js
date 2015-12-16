import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(transition) {
    if (transition.targetName === 'demos.index') {
      this.transitionTo('demos.emoji');
    }
  }
});
