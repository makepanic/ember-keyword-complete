import { helper } from '@ember/component/helper';
import ENV from 'dummy/config/environment';
import {get} from '@ember/object';

export function env([path]/*, hash*/) {
  return get(ENV, path);
}

export default helper(env);
