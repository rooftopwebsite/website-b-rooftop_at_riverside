import { activeTrucks, truckByName, type Truck } from '@/content/trucks';
import { withoutEmDash } from '@/lib/em-dash';
import { DEFAULT_MENU_LABEL, getTruckMenuOverrides, type TruckMenuButton } from '@/lib/sanity-truck-menus';
import menus from './menus.json';

export const BAR_MENU = 'Sunset Bar';

export interface MenuPdf {
  readonly name: string;
  readonly description: string | null;
  readonly pdfUrl: string;
}

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const isFromBar = (m: MenuPdf) => normalize(m.name) === normalize(BAR_MENU);

function getMenuPdfs(): readonly MenuPdf[] {
  return (menus as readonly { name: string; description: string | null; pdf: string | null; active: boolean }[])
    .filter((c) => c.active && c.pdf)
    .map((c) => ({
      name: c.name,
      description: withoutEmDash(c.description),
      pdfUrl: c.pdf as string,
    }));
}

export interface TruckMenuData {
  readonly name: string;
  readonly description: string | null;
  readonly pdfUrl: string | null;
  readonly menuLabel: string;
  readonly extraMenus: readonly TruckMenuButton[];
  readonly truck: Truck | null;
}

export async function truckMenus(): Promise<readonly TruckMenuData[]> {
  const menus = getMenuPdfs();
  const sanityMenus = await getTruckMenuOverrides();

  if (menus.length === 0) {
    return activeTrucks().map((t) => ({
      name: t.name,
      description: t.blurb ?? t.story,
      pdfUrl: t.menuImage,
      menuLabel: DEFAULT_MENU_LABEL,
      extraMenus: [],
      truck: t,
    }));
  }

  return menus.filter((m) => !isFromBar(m)).map((m) => {
    const truck = truckByName(m.name) ?? null;
    const live = truck ? sanityMenus.get(truck.slug) : undefined;
    return {
      name: truck?.name ?? m.name,
      description: m.description ?? truck?.blurb ?? truck?.story ?? null,
      pdfUrl: live?.main?.pdfUrl ?? m.pdfUrl,
      menuLabel: live?.main?.label ?? DEFAULT_MENU_LABEL,
      extraMenus: live?.football ? [live.football] : [],
      truck,
    };
  });
}
