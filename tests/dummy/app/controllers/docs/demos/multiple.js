import Controller from '@ember/controller';
import {emoji, users, commands} from 'dummy/utils/data-sources';

// BEGIN-SNIPPET docs-demo-multiple.js
export default Controller.extend({
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque distinctio doloremque excepturi non numquam repellendus sequi similique totam vel.',
  ds: {
    ':': emoji,
    '@': users,
    '/': commands
  }
});
// END-SNIPPET
