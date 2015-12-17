import Ember from 'ember';
import layout from '../templates/components/jsdoc-ast-item';

export default Ember.Component.extend({
  tagName: 'tr',
  classNames: ['jsdoc-ast-item'],
  layout: layout
});
