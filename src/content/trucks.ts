export interface Truck {
  readonly slug: string;
  readonly name: string;
  readonly cuisine: string;
  readonly specialty: string;
  readonly story: string | null;

  readonly blurb: string | null;
  readonly schedule: string | null;
  readonly instagram: string | null;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  readonly photoBrief: string;
  readonly menuImage: string | null;

  readonly gallery: readonly { src: string; alt: string }[];
  readonly nameConfirmed: boolean;

  readonly active: boolean;
}

export const TRUCKS: readonly Truck[] = [
  {
    slug: 'ocn-seafood-co',
    name: 'OCN Seafood Co.',
    cuisine: 'Seafood',
    specialty: 'Gulf catch, poke bowls and seafood boils',
    story: null,
    blurb: null,
    schedule: null,
    instagram: null,
    photo: '/images/trucks/ocn-seafood-1.webp',
    photoAlt: 'A seafood boil with crab legs, corn, potatoes and clams from OCN Seafood Co.',
    photoBrief:
      "El truck de OCN Seafood Co. abierto y atendiendo, al atardecer, con la ventanilla iluminada y gente pidiendo.",
    menuImage: null,
    gallery: [],
    nameConfirmed: true,
    active: false,
  },
  {
    slug: 'butchers-blvd',
    name: "Butcher's Blvd",
    cuisine: 'American',
    specialty: 'Smashburgers and American kitchen classics',
    story: null,
    blurb: null,
    schedule: null,
    instagram: null,
    photo: null,
    photoAlt: null,
    photoBrief:
      "El truck de Butcher's Blvd estacionado en el patio, más un primer plano de una smashburger saliendo.",
    menuImage: null,
    gallery: [],
    nameConfirmed: true,
    active: false,
  },
  {
    slug: 'el-chilango',
    name: 'El Chilango MX',
    cuisine: 'Mexican',
    specialty: 'Street tacos and fresh salsas',
    story:
      'El Chilango brings the vibrant flavors of Mexico to Rooftop at Riverside. Authentic street tacos, fresh salsas and traditional Mexican favorites, right in the heart of Bonita Springs.',
    blurb:
      'Authentic street tacos, fresh salsas and traditional Mexican plates.',
    schedule: null,
    instagram: 'https://www.instagram.com/el_chilango_mx/',
    photo: '/images/trucks/el-chilango-3.webp',
    photoAlt: 'Chilaquiles with pulled pork, avocado and crema from El Chilango MX',
    photoBrief: "El truck por fuera, con el cartel legible.",
    menuImage: '/menus/el-chilango-mx.jpg',
    gallery: [
      {
        src: '/images/trucks/el-chilango-2.webp',
        alt: 'A rice bowl with shrimp, black beans, corn and guacamole from El Chilango MX',
      },
      {
        src: '/images/trucks/el-chilango-1.webp',
        alt: 'The El Chilango MX truck artwork, a flowered calavera over the truck name',
      },
    ],
    nameConfirmed: true,
    active: true,
  },
  {
    slug: 'reggae-kitchen',
    name: 'Reggae Kitchen',
    cuisine: 'Jamaican',
    specialty: 'Jamaican food',
    story:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    blurb:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    schedule: null,
    instagram: null,
    photo: null,
    photoAlt: null,
    photoBrief:
      "El truck de Reggae Kitchen con el cartel legible, y un plato servido que muestre el color de la comida.",
    menuImage: null,
    gallery: [],
    nameConfirmed: false,
    active: false,
  },

  {
    slug: 'prime-carvery',
    name: 'Prime Carvery',
    cuisine: 'American',
    specialty: 'Elevated American comfort food',
    story:
      'Prime Carvery American Kitchen redefines American classics with a focus on quality and flavor. Known for their high-quality offerings, they take pride in crafting dishes that leave taste buds rejoicing. Every dish reflects a commitment to elevating classic American comfort food to new heights.',
    blurb:
      'American classics, made with a focus on quality and flavor.',
    schedule: null,
    instagram: null,
    photo: '/images/trucks/prime-carvery-1.jpg',
    photoAlt: 'A burger with melted cheese served from the Prime Carvery truck',
    photoBrief: "El truck por fuera, con el cartel legible, abierto y atendiendo.",
    menuImage: null,
    gallery: [],
    nameConfirmed: true,
    active: true,
  },
  {
    slug: 'sea-me-on-wheels',
    name: 'Sea Me on Wheels',
    cuisine: 'Seafood',
    specialty: 'Shrimp, ceviche and seafood boils',
    story:
      "Sea Me on Wheels crafts a menu blending traditional recipes with innovative twists, inspired by the flavors of Florida's coastal cuisine.",
    blurb:
      'Traditional recipes with a twist, from the Florida coast.',
    schedule: null,
    instagram: null,
    photo: '/images/trucks/seafood-1.jpg',
    photoAlt: 'A poke bowl with fresh fish and vegetables from Sea Me on Wheels',
    photoBrief: "El truck por fuera, con el cartel legible, abierto y atendiendo.",
    menuImage: '/menus/sea-me-on-wheels.webp',
    gallery: [],
    nameConfirmed: true,
    active: true,
  },
  {
    slug: 'tropical-fusion',
    name: 'Tropical Fusion',
    cuisine: 'Fusion',
    specialty: 'Tropical fusion plates',
    story: null,
    blurb: null,
    schedule: null,
    instagram: null,
    photo: '/images/trucks/tropical-1.jpg',
    photoAlt: 'A plated dish from the Tropical Fusion food truck',
    photoBrief: 'El truck por fuera, con el cartel legible y un plato servido.',
    menuImage: null,
    gallery: [],
    nameConfirmed: true,
    active: true,
  },
];

export const activeTrucks = (): readonly Truck[] => TRUCKS.filter((t) => t.active);

export const nombreVisible = (t: Truck): string =>
  t.nameConfirmed ? t.name : 'Name unconfirmed';

export const truckBySlug = (slug: string): Truck | undefined =>
  TRUCKS.find((t) => t.slug === slug);

export function retiredTruckRedirects() {
  return TRUCKS.map((t) => ({
    source: `/food-trucks/${t.slug}`,
    destination: '/food-trucks',
    statusCode: 301,
  }));
}

const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export const truckPorNombre = (nombre: string): Truck | undefined =>
  TRUCKS.find((t) => normalizar(t.name) === normalizar(nombre));

export const menuDeTruck = (
  t: Truck,
  cartas: readonly { readonly name: string; readonly pdfUrl: string }[],
): string | null =>
  cartas.find((c) => normalizar(c.name) === normalizar(t.name))?.pdfUrl ?? t.menuImage;
