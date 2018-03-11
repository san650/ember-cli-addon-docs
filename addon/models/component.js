import DS from 'ember-data';
import { alias, or } from '@ember/object/computed';

import Class from './class';
import { memberUnion, memberSort, hasMemberType } from '../utils/computed';

const { attr } = DS;

export default Class.extend({
  isComponent: true,

  yields: attr(),
  arguments: attr(),

  sortedArguments: memberSort('arguments'),

  inheritedYields: alias('parentClass.overloadedYields'),
  inheritedArguments: alias('parentClass.allMethods'),

  allArguments: memberUnion('inheritedArguments', 'arguments'),
  allSortedArguments: memberSort('allArguments'),

  overloadedYields: or('yields', 'inheritedYields'),

  hasInherited: or(
    'inheritedYields.length',
    'inheritedArguments.length',
    'inheritedAccessors.length',
    'inheritedMethods.length',
    'inheritedFields.length'
  ),

  hasInternal: or(
    'allAccessors.length',
    'allMethods.length',
    'allFields.length'
  ),

  hasPrivate: hasMemberType(
    'allArguments',
    'allFields',
    'allAccessors',
    'allMethods',

    function(member) {
      return member.access === 'private';
    }
  ),

  hasProtected: hasMemberType(
    'allArguments',
    'allFields',
    'allAccessors',
    'allMethods',

    function(member) {
      return member.access === 'private';
    }
  ),

  hasDeprecated: hasMemberType(
    'allArguments',
    'allFields',
    'allAccessors',
    'allMethods',

    function(member) {
      return member.tags && member.tags.find(t => t.name === 'deprecated');
    }
  )
});
