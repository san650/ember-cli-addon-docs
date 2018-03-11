import { computed } from '@ember/object';

export function memberUnion(parentMembersKey, childMembersKey) {
  return computed(`${parentMembersKey}.[]`, `${childMembersKey}.[]`, function() {
    let parentMembers = this.get(parentMembersKey);
    let childMembers = this.get(childMembersKey);

    if (!parentMembers) {
      return childMembers;
    }

    let union = {};

    for (let member of parentMembers) {
      union[member.name] = member;
    }

    for (let member of childMembers) {
      union[member.name] = member;
    }

    return Object.values(union);
  });
}

export function memberSort(key) {
  return computed(`${key}.[]`, function() {
    let members = this.get(key);

    return members.sort((a, b) => {
      if (a.isStatic && !b.isStatic) {
        return -1;
      } else if (b.isStatic && !a.isStatic) {
        return 1;
      }

      if (
        a.access === 'public' && b.access !== 'public'
        || b.access === 'private' && a.access !== 'private'
      ) {
        return -1;
      } else if (
        a.access === 'private' && b.access !== 'private'
        || b.access === 'public' && a.access !== 'public') {
        return 1;
      }

      return a.name.localeCompare(b.name);
    })
  });
}

export function hasMemberType(...memberKeys) {
  let filter = memberKeys.pop();

  return computed(...memberKeys.map(k => `${k}.[]`), {
    get() {
      return memberKeys.some((memberKey) => {
        return this.get(memberKey).some((member) => filter(member, memberKey));
      });
    }
  });
}

