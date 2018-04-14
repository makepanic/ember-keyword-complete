import { helper } from '@ember/component/helper';

export function a([list]/*, hash*/) {
  return list.split(' ');
}

export default helper(a);
