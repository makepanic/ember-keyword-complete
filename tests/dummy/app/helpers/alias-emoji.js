/* global emojione */
import Ember from 'ember';

export function toEmoji(params/*, hash*/) {
  return new Ember.Handlebars.SafeString(emojione.shortnameToImage(`:${params[0]}:`));
}

export default Ember.Helper.helper(toEmoji);
