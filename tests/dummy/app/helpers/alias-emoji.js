/* global emojione */
import {htmlSafe} from "@ember/string";
import { helper } from '@ember/component/helper';

export function toEmoji(params/*, hash*/) {
  return htmlSafe(emojione.shortnameToImage(`:${params[0]}:`));
}

export default helper(toEmoji);
