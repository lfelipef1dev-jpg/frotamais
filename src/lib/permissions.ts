export type Role = 'admin' | 'manager' | 'driver';

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  manager: 'Gestor de Frota',
  driver: 'Motorista',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: 'Acesso total ao sistema, gestao de usuarios e configuracoes',
  manager: 'Gestao de frota, manutencao, combustivel e relatorios',
  driver: 'Acesso apenas as suas viagens, inspecoes e score de seguranca',
};

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: [
    'dashboard:view',
    'vehicles:view',
    'vehicles:edit',
    'vehicles:delete',
    'drivers:view',
    'drivers:edit',
    'drivers:delete',
    'routes:view',
    'routes:edit',
    'maintenance:view',
    'maintenance:edit',
    'maintenance:delete',
    'fuel:view',
    'fuel:edit',
    'fuel:delete',
    'alerts:view',
    'alerts:edit',
    'inspections:view',
    'inspections:edit',
    'reports:view',
    'users:view',
    'users:edit',
    'users:delete',
    'settings:view',
    'settings:edit',
  ],
  manager: [
    'dashboard:view',
    'vehicles:view',
    'vehicles:edit',
    'drivers:view',
    'drivers:edit',
    'routes:view',
    'routes:edit',
    'maintenance:view',
    'maintenance:edit',
    'maintenance:delete',
    'fuel:view',
    'fuel:edit',
    'fuel:delete',
    'alerts:view',
    'alerts:edit',
    'inspections:view',
    'inspections:edit',
    'reports:view',
  ],
  driver: [
    'dashboard:view',
    'routes:view',
    'inspections:view',
    'inspections:edit',
  ],
};

export function hasPermission(role: string | undefined | null, permission: string): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role as Role];
  if (!perms) return false;
  return perms.includes(permission);
}

export function canAccessRoute(role: string | undefined | null, pathname: string): boolean {
  if (!role) return false;

  // Admin ve tudo
  if (role === 'admin') return true;

  // Motorista so ve rotas e inspecoes
  if (role === 'driver') {
    return pathname === '/app/dashboard' ||
      pathname.startsWith('/app/routes') ||
      pathname.startsWith('/app/inspections');
  }

  // Gestor ve tudo exceto usuarios e configuracoes
  if (role === 'manager') {
    if (pathname.startsWith('/app/users') || pathname.startsWith('/app/settings')) {
      return false;
    }
    return true;
  }

  return false;
}
