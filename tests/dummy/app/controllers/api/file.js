import Ember from 'ember';

const {computed} = Ember;

export default Ember.Controller.extend({
  publicMember: computed.filterBy('model.items', 'access', 'public'),
  privateMember: computed.filterBy('model.items', 'access', 'private')
});
