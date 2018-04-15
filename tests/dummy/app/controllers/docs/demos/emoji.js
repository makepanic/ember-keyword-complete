import Controller from '@ember/controller';
import {emoji} from 'dummy/utils/data-sources';

// BEGIN-SNIPPET docs-demo-emoji.js
export default Controller.extend({
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque distinctio doloremque excepturi non numquam repellendus sequi similique totam vel.',
  ds: {
    ':': emoji
  },
});
// END-SNIPPET
