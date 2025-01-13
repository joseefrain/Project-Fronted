import { IRole, IRolePrivilege } from '../../interfaces/roleInterfaces';

export enum LEVEL_VALUES {
  READ = 0,
  CREATE = 1,
  UPDATE = 4,
  DELETE = 5,
}

export enum PAGES_MODULES {
  DASHBOARD = 'DASHBOARD',
  SUCURSALES = 'SUCURSALES',
  TRANSACCIONES = 'TRANSACCIONES',
  CREDITOS = 'CREDITOS',
  PRODUCTOS = 'PRODUCTOS',
  CATEGORIAS = 'CATEGORIAS',
  DESCUENTOS = 'DESCUENTOS',
  TRASLADOS = 'TRASLADOS',
  USUARIOS = 'USUARIOS',
  CONTACTOS = 'CONTACTOS',
  ROLES = 'ROLES',
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
    module: PAGES_MODULES.TRANSACCIONES,
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
];

export const isUserWithAllAccess = (roles: IRole[]): boolean => {
  // Crear un mapa combinado de módulos y niveles a partir de los roles del usuario
  const combinedPrivilegesMap: Record<string, Set<number>> = {};

  roles.forEach((role) => {
    role.privileges.forEach((privilege) => {
      const { module, levels } = privilege;

      // Inicializar el módulo en el mapa si no existe
      if (!combinedPrivilegesMap[module]) {
        combinedPrivilegesMap[module] = new Set();
      }

      // Agregar los niveles al módulo correspondiente
      levels.forEach((level) => combinedPrivilegesMap[module].add(level));
    });
  });

  // Validar que la combinación cumpla con DEFAULT_ROLE_PAGES
  for (const requiredPrivilege of DEFAULT_ROLE_PAGES) {
    const { module, levels: requiredLevels } = requiredPrivilege;

    // Si el módulo no está presente en los privilegios combinados, fallo
    if (!combinedPrivilegesMap[module]) {
      return false;
    }

    // Validar que todos los niveles requeridos estén presentes
    const moduleLevels = combinedPrivilegesMap[module];
    const hasAllRequiredLevels = requiredLevels.every((level) =>
      moduleLevels.has(level)
    );
    if (!hasAllRequiredLevels) {
      return false;
    }
  }

  return true; // Si pasa todas las validaciones, cumple con los privilegios requeridos
};
