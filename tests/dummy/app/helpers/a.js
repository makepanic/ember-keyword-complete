import Ember from 'ember';

export function a([list]/*, hash*/) {
  return list.split(' ');
}

export default Ember.Helper.helper(a);
