import Component from '@ember/component';
import layout from '../templates/components/jsdoc-ast-item';

export default Component.extend({
  tagName: 'tr',
  classNames: ['jsdoc-ast-item'],
  layout
});
