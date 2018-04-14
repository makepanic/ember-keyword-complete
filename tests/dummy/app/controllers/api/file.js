import Controller from '@ember/controller';
import {computed} from '@ember/object';

export default Controller.extend({
  publicMember: computed.filterBy('model.items', 'access', 'public'),
  privateMember: computed.filterBy('model.items', 'access', 'private')
});
