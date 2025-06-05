import { defineAbility } from '@casl/ability';

import { RolesE } from '../types/enums';

import { permissions } from '../config/permissions';

export function defineAbilityFor(role: RolesE, id?: string) {
  return defineAbility((allow) => {
    if (role === RolesE.OWNER) {
      permissions.owner.forEach((permission) => allow(permission.action, permission.subject));
    } else if (role === RolesE.ADMIN) {
      permissions.admin.forEach((permission) => allow(permission.action, permission.subject));
    } else if (role === RolesE.MEMBER) {
      permissions.member.forEach((permission) =>
        allow(permission.action, permission.subject, { id })
      );
    } else {
      throw 'Invalid Role';
    }
  });
}
