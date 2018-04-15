import Controller from '@ember/controller';
import {emoji} from 'dummy/utils/data-sources';

// BEGIN-SNIPPET docs-demo-index.js
export default Controller.extend({
  text: 'This is a generic textarea with an emoji data source.\n\nType `:` to get emoji completions.\n\n',
  ds: {
    ':': emoji
  },
});
// END-SNIPPET
