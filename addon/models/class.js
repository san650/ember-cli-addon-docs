import DS from 'ember-data';
import { alias, or } from '@ember/object/computed';
import { memberUnion, memberSort, hasMemberType } from '../utils/computed';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  parentClass: belongsTo('class', { async: false, inverse: null }),

  isClass: true,

  name: attr(),
  file: attr(),
  exportType: attr(),
  description: attr(),
  lineNumber: attr(),
  access: attr(),

  accessors: attr(),
  methods: attr(),
  fields: attr(),
  tags: attr(),

  sortedAccessors: memberSort('accessors'),
  sortedMethods: memberSort('methods'),
  sortedFields: memberSort('fields'),

  inheritedAccessors: alias('parentClass.allAccessors'),
  inheritedMethods: alias('parentClass.allMethods'),
  inheritedFields: alias('parentClass.allFields'),

  allAccessors: memberUnion('inheritedAccessors', 'accessors'),
  allMethods: memberUnion('inheritedMethods', 'methods'),
  allFields: memberUnion('inheritedFields', 'fields'),

  allSortedAccessors: memberSort('allAccessors'),
  allSortedMethods: memberSort('allMethods'),
  allSortedFields: memberSort('allFields'),

  hasInherited: or(
    'inheritedAccessors.length',
    'inheritedMethods.length',
    'inheritedFields.length'
  ),

  hasPrivate: hasMemberType(
    'allFields',
    'allAccessors',
    'allMethods',

    function(member) {
      return member.access === 'private';
    }
  ),

  hasProtected: hasMemberType(
    'allFields',
    'allAccessors',
    'allMethods',

    function(member) {
      return member.access === 'protected';
    }
  ),

  hasDeprecated: hasMemberType(
    'allFields',
    'allAccessors',
    'allMethods',
    function(member) {
      return member.tags && member.tags.find(t => t.name === 'deprecated');
    }
  )
});
