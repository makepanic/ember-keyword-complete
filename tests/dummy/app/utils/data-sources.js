import ENV from 'dummy/config/environment';
import RSVP from 'rsvp';
import {run} from '@ember/runloop';

// BEGIN-SNIPPET docs-demo-source-emoji.js
export const emoji = {
  component: 'emoji-item',
  extractDataString(item) {
    return `:${item.val}:`;
  },
  loadSuggestions(query) {
    return RSVP.resolve(ENV.APP.EMOJIS.filter(item => `:${item.val}:`.indexOf(query) !== -1));
  }
};
// END-SNIPPET

// BEGIN-SNIPPET docs-demo-source-user.js
export const users = {
  component: 'user-item',
  extractDataString(item) {
    return `@${item.nick}`;
  },
  loadSuggestions(query) {
    const queryLower = query.substring(1).toLowerCase();
    return new RSVP.Promise(res => {
      run.later(this, () => {
        res(ENV.APP.USERS.filter(item => item.nick.toLowerCase().startsWith(queryLower)));
      }, 100);
    });
  }
};
// END-SNIPPET

// BEGIN-SNIPPET docs-demo-source-command.js
export const commands = {
  minQueryLength: 0,
  component: 'command-item',
  itemClassName: 'complete-command-item',
  extractDataString(item) {
    return `/${item.name} `;
  },
  loadSuggestions(query) {
    return RSVP.resolve(ENV.APP.COMMANDS
      .filter(c => c.name.toLowerCase().indexOf(query.toLowerCase().substring(1)) === 0));
  }
};
// END-SNIPPET

// BEGIN-SNIPPET docs-demo-source-random.js
const words = [
  'hello',
  'darkness',
  'my',
  'old',
  'friend',
];
export const random = {
  minQueryLength: 0,
  component: 'tag-item',
  itemClassName: 'complete-tag-item',
  extractDataString(item) {
    return `#${item} `;
  },
  loadSuggestions() {
    return new RSVP.Promise(res => {
      run.later(this, () => {
        let randomWords = new Array(words.length).join(',').split(',').map(() => {
          return words[Math.floor(Math.random() * words.length)]
        });

        res(randomWords);
      }, 100);
    });
  }
};
// END-SNIPPET
