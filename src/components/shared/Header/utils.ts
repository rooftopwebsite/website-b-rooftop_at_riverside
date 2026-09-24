export function getRoute(pathname: string): string {
  return pathname === '/' ? '/' : pathname.replace(/\/$/, '');
}

export function isCurrentPath(route: string, href: string): boolean {
  return route === href || route.startsWith(`${href}/`);
}
