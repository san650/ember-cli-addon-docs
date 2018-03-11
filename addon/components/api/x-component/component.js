import Component from '@ember/component';
import { computed } from '@ember/object';
import { capitalize } from '@ember/string';

import layout from './template';

function memberFilter(memberKey, allMemberKey, isInternal) {
  return computed(
    'showInherited',
    'showInternal',
    'showProtected',
    'showPrivate',
    'showDeprecated',
    `${memberKey}.[]`,
    `${allMemberKey}.[]`,
    {
      get() {
        let showInherited = this.get('showInherited');
        let showInternal = this.get('showInternal');
        let showProtected = this.get('showProtected');
        let showPrivate = this.get('showPrivate');
        let showDeprecated = this.get('showDeprecated');

        if (!showInternal && isInternal) {
          return [];
        }

        let members = showInherited ? this.get(allMemberKey) : this.get(memberKey);

        if (members) {
          return members.filter((m) => {
            if (!showProtected && m.access === 'protected') {
              return false;
            }

            if (!showPrivate && m.access === 'private') {
              return false;
            }

            if (!showDeprecated && m.tags && m.tags.find(t => t.name === 'deprecated')) {
              return false;
            }

            return true;
          });
        }
      }
    }
  );
}

export default Component.extend({
  layout,

  showInherited: false,
  showInternal: false,
  showProtected: false,
  showPrivate: false,
  showDeprecated: false,

  yields: memberFilter('component.yields', 'component.overloadedYields'),
  arguments: memberFilter('component.sortedArguments', 'component.allSortedArguments'),
  fields: memberFilter('component.sortedFields', 'component.allSortedFields', true),
  accessors: memberFilter('component.sortedAccessors', 'component.allSortedAccessors', true),
  methods: memberFilter('component.sortedMethods', 'component.allSortedMethods', true),

  hasContents: computed('component', {
    get() {
      let component = this.get('component');

      return component.get('constructors.length') > 0
        || component.get('yields.length') > 0
        || component.get('arguments.length') > 0
        || component.get('fields.length') > 0
        || component.get('accessors.length') > 0
        || component.get('methods.length') > 0;
    }
  }),

  actions: {
    updateFilter(filter, { target: { checked } }) {
      this.set(`show${capitalize(filter)}`, checked);
    }
  }
});
