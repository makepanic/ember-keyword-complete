import config from 'dummy/config/environment';
import groupAst from 'dummy/utils/group-ast';

export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
  config.APP.GROUPED_AST = groupAst(config.APP.AST);
}

export default {
  name: 'process-ast',
  initialize
};
