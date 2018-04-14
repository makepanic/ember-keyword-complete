import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel(transition) {
    if (transition.targetName === 'demos.index') {
      this.transitionTo('demos.emoji');
    }
  }
});
