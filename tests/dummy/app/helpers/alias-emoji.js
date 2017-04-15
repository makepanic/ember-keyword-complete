/* global emojione */
import Ember from 'ember';

const {String: {htmlSafe}} = Ember;

export function toEmoji(params/*, hash*/) {
  return htmlSafe(emojione.shortnameToImage(`:${params[0]}:`));
}

export default Ember.Helper.helper(toEmoji);
