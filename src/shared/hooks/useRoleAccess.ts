import { useAppSelector } from '../../app/hooks';
import {
  getPriveligesByRoles,
  LEVEL_VALUES,
  PAGES_MODULES,
} from '../helpers/roleHelper';

export const useRoleAccess = (module: PAGES_MODULES) => {
  const roles = useAppSelector((state) => state.auth.signIn.user?.roles);
  const moduleFound = getPriveligesByRoles(roles ?? []).find(
    (role) => role.module === module
  );

  if (!moduleFound) {
    return {
      create: false,
      read: false,
      update: false,
      delete: false,
    };
  }

  return {
    create: moduleFound.levels.includes(LEVEL_VALUES.CREATE),
    read: moduleFound.levels.includes(LEVEL_VALUES.READ),
    update: moduleFound.levels.includes(LEVEL_VALUES.UPDATE),
    delete: moduleFound.levels.includes(LEVEL_VALUES.DELETE),
  };
};
