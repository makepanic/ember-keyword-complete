import Controller from '@ember/controller';
import {emoji} from 'dummy/utils/data-sources';
import ENV from 'dummy/config/environment';

export default Controller.extend({
  emojis: ENV.APP.EMOJIS,
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque distinctio doloremque excepturi non numquam repellendus sequi similique totam vel.',
  ds: {
    ':': emoji
  }
});
