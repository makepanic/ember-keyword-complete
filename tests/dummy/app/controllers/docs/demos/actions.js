import Controller from '@ember/controller';
import {emoji, random} from 'dummy/utils/data-sources';

export default Controller.extend({
  textMoveCaret: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque distinctio doloremque excepturi non numquam repellendus sequi similique totam vel.',
  textPreselect: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque distinctio doloremque excepturi non numquam repellendus sequi similique totam vel.',
  textRefresh: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque distinctio doloremque excepturi non numquam repellendus sequi similique totam vel.',

  ds: {
    ':': emoji,
    '#': random
  },
});
