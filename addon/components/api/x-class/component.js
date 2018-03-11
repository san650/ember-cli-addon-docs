import Component from '@ember/component';
import { computed } from '@ember/object';
import { capitalize } from '@ember/string';

import layout from './template';

function memberFilter(memberKey, allMemberKey) {
  return computed(
    'showInherited',
    'showProtected',
    'showPrivate',
    'showDeprecated',
    `${memberKey}.[]`,
    `${allMemberKey}.[]`,
    function() {
      let showInherited = this.get('showInherited');
      let showProtected = this.get('showProtected');
      let showPrivate = this.get('showPrivate');
      let showDeprecated = this.get('showDeprecated');

      let members = showInherited ? this.get(allMemberKey) : this.get(memberKey);

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
      });
    }
  );
}

export default Component.extend({
  layout,

  showInherited: false,
  showProtected: false,
  showPrivate: false,
  showDeprecated: false,

  fields: memberFilter('class.sortedFields', 'class.allSortedFields'),
  accessors: memberFilter('class.sortedAccessors', 'class.allSortedAccessors'),
  methods: memberFilter('class.sortedMethods', 'class.allSortedMethods'),

  hasContents: computed('class', {
    get() {
      let klass = this.get('class');

      return klass.get('allSortedConstructors.length') > 0
        || klass.get('allSortedFields.length') > 0
        || klass.get('allSortedAccessors.length') > 0
        || klass.get('allSortedMethods.length') > 0;
    }
  }),

  actions: {
    updateFilter(filter, { target: { checked } }) {
      this.set(`show${capitalize(filter)}`, checked);
    }
  }
});
