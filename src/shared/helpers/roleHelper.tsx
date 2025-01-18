import { IRole, IRolePrivilege } from '../../interfaces/roleInterfaces';
import {
  BadgeDollarSign,
  CreditCard,
  Group,
  House,
  Repeat,
  ShoppingBag,
  ShoppingCart,
  SquareUser,
  Store,
  UserPlus,
  Waypoints,
} from 'lucide-react';

export enum LEVEL_VALUES {
  READ = 0,
  CREATE = 1,
  UPDATE = 4,
  DELETE = 5,
}

export enum PAGES_MODULES {
  DASHBOARD = 'DASHBOARD',
  SUCURSALES = 'SUCURSALES',
  VENTAS = 'VENTAS',
  COMPRAS = 'COMPRAS',
  CREDITOS = 'CREDITOS',
  PRODUCTOS = 'PRODUCTOS',
  CATEGORIAS = 'CATEGORIAS',
  DESCUENTOS = 'DESCUENTOS',
  TRASLADOS = 'TRASLADOS',
  USUARIOS = 'USUARIOS',
  CONTACTOS = 'CONTACTOS',
  ROLES = 'ROLES',
  CASHREGISTER = 'CASHREGISTER',
}

export const getLevelValueLabel = (level: number) => {
  switch (level) {
    case LEVEL_VALUES.READ:
      return 'Leer';
    case LEVEL_VALUES.CREATE:
      return 'Crear';
    case LEVEL_VALUES.UPDATE:
      return 'Actualizar';
    case LEVEL_VALUES.DELETE:
      return 'Eliminar';
    default:
      return 'Ninguno';
  }
};

export const DEFAULT_ROLE_PAGES: IRolePrivilege[] = [
  {
    module: PAGES_MODULES.DASHBOARD,
    levels: [LEVEL_VALUES.READ],
  },
  {
    module: PAGES_MODULES.SUCURSALES,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.VENTAS,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.COMPRAS,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.CREDITOS,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.PRODUCTOS,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.CATEGORIAS,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.DESCUENTOS,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.TRASLADOS,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.USUARIOS,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.CONTACTOS,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.ROLES,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
  {
    module: PAGES_MODULES.CASHREGISTER,
    levels: [
      LEVEL_VALUES.CREATE,
      LEVEL_VALUES.READ,
      LEVEL_VALUES.UPDATE,
      LEVEL_VALUES.DELETE,
    ],
  },
];

export const isUserWithAllAccess = (roles: IRole[]): boolean => {
  const combinedPrivilegesMap: Record<string, Set<number>> = {};

  roles.forEach((role) => {
    role.privileges.forEach((privilege) => {
      const { module, levels } = privilege;

      if (!combinedPrivilegesMap[module]) {
        combinedPrivilegesMap[module] = new Set();
      }

      levels.forEach((level) => combinedPrivilegesMap[module].add(level));
    });
  });

  for (const requiredPrivilege of DEFAULT_ROLE_PAGES) {
    const { module, levels: requiredLevels } = requiredPrivilege;

    if (!combinedPrivilegesMap[module]) {
      return false;
    }

    const moduleLevels = combinedPrivilegesMap[module];
    const hasAllRequiredLevels = requiredLevels.every((level) =>
      moduleLevels.has(level)
    );
    if (!hasAllRequiredLevels) {
      return false;
    }
  }

  return true;
};

export const sidebarLinks = [
  {
    name: 'INICIO',
    path: '/',
    module: PAGES_MODULES.DASHBOARD,
    icon: <House />,
  },

  {
    name: 'SUCURSALES',
    path: '/branches',
    icon: <Store />,
    module: PAGES_MODULES.SUCURSALES,
  },
  {
    name: 'VENTAS',
    path: '/sales',
    icon: <Waypoints />,
    module: PAGES_MODULES.VENTAS,
  },
  {
    name: 'COMPRAS',
    path: '/purchase',
    icon: <ShoppingCart />,
    module: PAGES_MODULES.COMPRAS,
  },
  {
    name: 'CRÉDITOS',
    path: '/credits',
    icon: <CreditCard />,
    module: PAGES_MODULES.CREDITOS,
  },
  {
    name: 'PRODUCTOS',
    path: '/products',
    icon: <ShoppingCart />,
    module: PAGES_MODULES.PRODUCTOS,
  },
  {
    name: 'CATEGORÍAS',
    path: '/categories',
    icon: <Group />,
    module: PAGES_MODULES.CATEGORIAS,
  },
  {
    name: 'DESCUENTOS',
    path: '/DiscountManager',
    icon: <BadgeDollarSign />,
    module: PAGES_MODULES.DESCUENTOS,
  },
  {
    name: 'TRASLADOS',
    path: '/orders',
    icon: <Repeat />,
    module: PAGES_MODULES.TRASLADOS,
  },
  {
    name: 'USUARIOS',
    path: '/register',
    icon: <UserPlus />,
    module: PAGES_MODULES.USUARIOS,
  },
  {
    name: 'CONTACTOS',
    path: '/contacts',
    icon: <SquareUser />,
    module: PAGES_MODULES.CONTACTOS,
  },
  {
    name: 'ROLES',
    path: '/roles',
    icon: <Waypoints />,
    module: PAGES_MODULES.ROLES,
  },

  {
    name: 'CAJAS',
    path: '/cashRegister',
    icon: <CreditCard />,
    module: PAGES_MODULES.CASHREGISTER,
  },
];

export const getPriveligesByRoles = (roles: IRole[]) => {
  const privileges = roles.map((role) => role.privileges);
  return privileges.flat();
};

const getSidebarLinks = (roles: IRole[]) => {
  const privileges = getPriveligesByRoles(roles);

  const filteredLinks = sidebarLinks.filter((link) => {
    const hasRole = privileges.find((role) => {
      return role.module === link.module;
    });
    return hasRole && hasRole.levels.includes(LEVEL_VALUES.READ);
  });

  return filteredLinks;
};

export const getSidebarLinksByRoles = (roles: IRole[]) => {
  const filteredLinks = getSidebarLinks(roles);

  return filteredLinks;
};

export const hasLevelInModuleByRoles = (
  roles: IRole[],
  module: string,
  level: number
) => {
  const hasLevelInModule = roles.find((role) => {
    return role.privileges.find((privilege) => {
      return privilege.module === module && privilege.levels.includes(level);
    });
  });

  return hasLevelInModule;
};
