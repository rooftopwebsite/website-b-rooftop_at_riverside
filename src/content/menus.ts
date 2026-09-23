import { getMenuPdfs, type MenuPdf } from '@/lib/restoexp';
import { activeTrucks, truckPorNombre, type Truck } from '@/content/trucks';

export const CARTA_DEL_BAR = 'Sunset Bar';

const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const esDelBar = (m: MenuPdf) => normalizar(m.name) === normalizar(CARTA_DEL_BAR);

export interface CartaDeTruck {
  readonly name: string;
  readonly description: string | null;
  readonly pdfUrl: string | null;
  readonly truck: Truck | null;
}

export async function cartasDeTrucks(): Promise<readonly CartaDeTruck[]> {
  const cartas = await getMenuPdfs();

  if (cartas.length === 0) {
    return activeTrucks().map((t) => ({
      name: t.name,
      description: t.blurb ?? t.story,
      pdfUrl: t.menuImage,
      truck: t,
    }));
  }

  return cartas.filter((m) => !esDelBar(m)).map((m) => {
    const truck = truckPorNombre(m.name) ?? null;
    return {
      name: truck?.name ?? m.name,
      description: m.description ?? truck?.blurb ?? truck?.story ?? null,
      pdfUrl: m.pdfUrl,
      truck,
    };
  });
}

export async function cartaDelBar(): Promise<MenuPdf | null> {
  const cartas = await getMenuPdfs();
  return cartas.find(esDelBar) ?? null;
}
