import Ember from 'ember';
import {emoji, users} from '../utils/data-sources';

export default Ember.Controller.extend({
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque distinctio doloremque excepturi non numquam repellendus sequi similique totam vel.',
  ds: {
    ':': emoji,
    '@': users
  }
});
