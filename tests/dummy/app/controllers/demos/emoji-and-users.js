import Controller from '@ember/controller';
import {emoji, users, commands} from 'dummy/utils/data-sources';
import ENV from 'dummy/config/environment';

export default Controller.extend({
  emojis: ENV.APP.EMOJIS,
  users: ENV.APP.USERS,
  commands: ENV.APP.COMMANDS,
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque distinctio doloremque excepturi non numquam repellendus sequi similique totam vel.',
  ds: {
    ':': emoji,
    '@': users,
    '/': commands
  }
});
