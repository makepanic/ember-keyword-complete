import ENV from 'dummy/config/environment';
import Ember from 'ember';

const {RSVP} = Ember;

export let emoji = {
  component: 'emoji-item',
  extractDataString(item) {
    return `:${item.val}:`;
  },
  loadSuggestions(query) {
    return RSVP.resolve(ENV.APP.EMOJIS.filter(item => `:${item.val}:`.indexOf(query) !== -1));
  }
};

export let users = {
  component: 'user-item',
  extractDataString(item) {
    return `@${item.nick}`;
  },
  loadSuggestions(query) {
    const queryLower = query.substring(1).toLowerCase();
    return new RSVP.Promise(res => {
      Ember.run.later(this, () => {
        res(ENV.APP.USERS.filter(item => item.nick.toLowerCase().startsWith(queryLower)));
      }, Math.random() * 100);
    });
  }
};
