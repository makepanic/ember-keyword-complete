import Ember from 'ember';
import {emoji} from '../utils/data-sources';
import ENV from 'dummy/config/environment';

export default Ember.Controller.extend({
  emojis: ENV.APP.EMOJIS,
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque distinctio doloremque excepturi non numquam repellendus sequi similique totam vel.',
  ds: {
    ':': emoji
  }
});
