import type { Hours } from '@/types/content';
import { fetchConTimeout } from './http';

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RESTAURANT_ID = process.env.NEXT_PUBLIC_SUPABASE_RESTAURANT_ID;

const REVALIDATE = 60;

export interface RestoexpLocation {
  readonly id: string;
  readonly name: string;
  readonly address: string | null;
  readonly city: string | null;
  readonly country: string | null;
  readonly phone: string | null;
  readonly email: string | null;
  readonly website_url: string | null;
  readonly google_maps_url: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly timezone: string | null;
  readonly social_links: readonly { readonly platform: string; readonly url: string }[] | null;
}

interface LocationHourRow {
  readonly day_of_week: number;
  readonly open_time: string | null;
  readonly close_time: string | null;
  readonly is_closed: boolean;
}

export function sinEmDash(t: string): string;
export function sinEmDash(t: string | null): string | null;
export function sinEmDash(t: string | null): string | null {
  if (!t || !t.includes('—')) return t;
  return t
    .split('—')
    .map((p) => p.trim())
    .reduce((acc, parte, i) => {
      if (i === 0) return parte;
      if (!parte) return acc;
      const palabras = acc.split(/\s+/).filter(Boolean).length;
      if (palabras <= 3) return `${acc}: ${parte}`;
      const conMayuscula = parte.charAt(0).toUpperCase() + parte.slice(1);
      return `${acc.replace(/[.,;:]$/, '')}. ${conMayuscula}`;
    }, '')
    .trim();
}

async function query<T>(path: string): Promise<readonly T[]> {
  if (!URL_BASE || !ANON || !RESTAURANT_ID) {
    console.warn('[restoexp] faltan variables de Supabase, se usa el contenido local');
    return [];
  }
  try {
    const res = await fetchConTimeout(`${URL_BASE}/rest/v1/${path}`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
      next: { revalidate: REVALIDATE, tags: ['restoexp'] },
    });
    if (!res.ok) {
      console.error(`[restoexp] ${path} devolvió ${res.status}`);
      return [];
    }
    return (await res.json()) as readonly T[];
  } catch (e) {
    console.error('[restoexp]', e instanceof Error ? e.message : e);
    return [];
  }
}

export async function getLocation(): Promise<RestoexpLocation | null> {
  const rows = await query<RestoexpLocation>(
    `locations?restaurant_id=eq.${RESTAURANT_ID}&select=*&limit=1`,
  );
  return rows[0] ?? null;
}

const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function reloj(t: string | null): string {
  if (!t) return '';
  const [hRaw, m] = t.split(':');
  const h = Number(hRaw);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}

export async function getHours(location: string): Promise<readonly Hours[] | null> {
  const rows = await query<LocationHourRow>(
    `location_hours?location_id=eq.${location}&select=day_of_week,open_time,close_time,is_closed&order=day_of_week`,
  );
  if (rows.length === 0) return null;

  const porDia = new Map(rows.map((r) => [r.day_of_week, r]));
  const orden = [1, 2, 3, 4, 5, 6, 0];

  return orden.map((d) => {
    const r = porDia.get(d);
    return {
      day: DIAS[d],
      bar: !r || r.is_closed ? 'Closed' : `${reloj(r.open_time)} – ${reloj(r.close_time)}`,
      trucks: '',
    };
  });
}

export interface MenuPdf {
  readonly name: string;
  readonly description: string | null;
  readonly pdfUrl: string;
}

export async function getMenuPdfs(): Promise<readonly MenuPdf[]> {
  const rows = await query<{
    name: string;
    description: string | null;
    pdf_url: string | null;
    is_active: boolean;
  }>(
    `menus?restaurant_id=eq.${RESTAURANT_ID}&select=name,description,pdf_url,is_active&order=sort_order,name`,
  );
  return rows
    .filter((r) => r.is_active && r.pdf_url)
    .map((r) => ({
      name: r.name,
      description: sinEmDash(r.description),
      pdfUrl: r.pdf_url as string,
    }));
}

export interface MenuRow {
  readonly name: string;
  readonly description: string | null;
  readonly base_price: number | null;
  readonly is_active: boolean;
  readonly sort_order: number | null;
}

export interface MenuGroup {
  readonly title: string;
  readonly note: string | null;
  readonly items: readonly MenuRow[];
}

export async function getMenu(): Promise<readonly MenuGroup[] | null> {
  const menus = await query<{ id: string }>(
    `menus?restaurant_id=eq.${RESTAURANT_ID}&select=id&limit=1`,
  );
  const menu = menus[0];
  if (!menu) return null;

  const cats = await query<{ id: string; name: string; description: string | null }>(
    `menu_categories?menu_id=eq.${menu.id}&select=id,name,description&order=sort_order`,
  );
  if (cats.length === 0) return null;

  const grupos = await Promise.all(
    cats.map(async (c) => {
      const items = await query<MenuRow>(
        `menu_items?category_id=eq.${c.id}&select=name,description,base_price,is_active,sort_order&order=sort_order`,
      );
      return {
        title: sinEmDash(c.name),
        note: sinEmDash(c.description),
        items: items
          .filter((i) => i.is_active)
          .map((i) => ({
            ...i,
            name: sinEmDash(i.name),
            description: sinEmDash(i.description),
          })),
      };
    }),
  );

  return grupos.filter((g) => g.items.length > 0);
}

export async function getBarMenu(): Promise<readonly DishGroup[] | null> {
  const menus = await query<{ id: string }>(
    `menus?restaurant_id=eq.${RESTAURANT_ID}&select=id&limit=1`,
  );
  const menu = menus[0];
  if (!menu) return null;

  const cats = await query<{ id: string; name: string; description: string | null }>(
    `menu_categories?menu_id=eq.${menu.id}&select=id,name,description&order=sort_order`,
  );
  if (cats.length === 0) return null;

  const grupos = await Promise.all(
    cats.map(async (c) => {
      const items = await query<Dish>(
        `menu_items?category_id=eq.${c.id}&select=${CAMPOS_PLATO}&order=sort_order`,
      );
      return {
        title: sinEmDash(c.name) ?? c.name,
        note: sinEmDash(c.description),
        items: items
          .filter((i) => i.is_active)
          .map((i) => ({
            ...i,
            name: sinEmDash(i.name) ?? i.name,
            description: sinEmDash(i.description),
            notes: sinEmDash(i.notes),
          })),
      };
    }),
  );

  const conPlatos = grupos.filter((g) => g.items.length > 0);
  return conPlatos.length > 0 ? conPlatos : null;
}

export interface Dish {
  readonly name: string;
  readonly description: string | null;
  readonly base_price: number | null;
  readonly base_price_max: number | null;
  readonly base_is_price_range: boolean;
  readonly price_variants: readonly { name?: string | null; price?: number | string | null }[] | null;
  readonly discount_percent: number | null;
  readonly show_currency: boolean;
  readonly image_url: string | null;
  readonly image_alt: string | null;
  readonly spice_level: number | null;
  readonly calories: number | null;
  readonly cooking_time_minutes: number | null;
  readonly allergens: readonly string[] | null;
  readonly tags: readonly string[] | null;
  readonly notes: string | null;
  readonly is_new: boolean;
  readonly is_suggested: boolean;
  readonly is_vegan: boolean;
  readonly is_vegetarian: boolean;
  readonly is_gluten_free: boolean;
  readonly is_dairy_free: boolean;
  readonly is_nut_free: boolean;
  readonly is_halal: boolean;
  readonly is_keto: boolean;
  readonly is_organic: boolean;
  readonly contains_alcohol: boolean;
  readonly is_active: boolean;
  readonly sort_order: number | null;
}

export interface DishGroup {
  readonly title: string;
  readonly note: string | null;
  readonly items: readonly Dish[];
}

const CAMPOS_PLATO =
  'name,description,base_price,base_price_max,base_is_price_range,price_variants,' +
  'discount_percent,show_currency,image_url,image_alt,spice_level,calories,' +
  'cooking_time_minutes,allergens,tags,notes,is_new,is_suggested,is_vegan,' +
  'is_vegetarian,is_gluten_free,is_dairy_free,is_nut_free,is_halal,is_keto,' +
  'is_organic,contains_alcohol,is_active,sort_order';

function normalizar(t: string): string {
  return t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export async function getTruckMenu(nombreTruck: string): Promise<readonly DishGroup[] | null> {
  const menus = await query<{ id: string; name: string }>(
    `menus?restaurant_id=eq.${RESTAURANT_ID}&select=id,name`,
  );

  const buscado = normalizar(nombreTruck);
  const menu = menus.find((m) => normalizar(m.name) === buscado);
  if (!menu) return null;

  const cats = await query<{ id: string; name: string; description: string | null }>(
    `menu_categories?menu_id=eq.${menu.id}&select=id,name,description&order=sort_order`,
  );
  if (cats.length === 0) return null;

  const grupos = await Promise.all(
    cats.map(async (c) => {
      const items = await query<Dish>(
        `menu_items?category_id=eq.${c.id}&select=${CAMPOS_PLATO}&order=sort_order`,
      );
      return {
        title: sinEmDash(c.name) ?? c.name,
        note: sinEmDash(c.description),
        items: items
          .filter((i) => i.is_active)
          .map((i) => ({
            ...i,
            name: sinEmDash(i.name) ?? i.name,
            description: sinEmDash(i.description),
            notes: sinEmDash(i.notes),
          })),
      };
    }),
  );

  const conPlatos = grupos.filter((g) => g.items.length > 0);
  return conPlatos.length > 0 ? conPlatos : null;
}

export interface RawEventRow {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly bannerUrl: string | null;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly startTime: string;
  readonly endTime: string | null;
  readonly isRecurring: boolean;
  readonly recurrenceType: string | null;
  readonly recurrenceDays: string | null;
  readonly price: number | string | null;
  readonly tags: readonly string[];
}

interface EventDbRow {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly banner_url: string | null;
  readonly start_date: string;
  readonly end_date: string | null;
  readonly start_time: string | null;
  readonly end_time: string | null;
  readonly is_recurring: boolean;
  readonly recurrence_type: string | null;
  readonly recurrence_days: unknown;
  readonly price: number | string | null;
  readonly tags: readonly string[] | null;
  readonly status: string | null;
}

export async function getEvents(): Promise<readonly RawEventRow[] | null> {
  const rows = await query<EventDbRow>(
    `location_events?restaurant_id=eq.${RESTAURANT_ID}&select=*&order=sort_order`,
  );
  if (rows.length === 0) return null;

  return rows
    .filter((r) => r.status === null || r.status === 'active' || r.status === 'published')
    .map((r) => ({
      id: r.id,
      title: sinEmDash(r.title),
      description: sinEmDash(r.description) ?? '',
      bannerUrl: r.banner_url,
      startDate: r.start_date,
      endDate: r.end_date,
      startTime: r.start_time ?? '00:00:00',
      endTime: r.end_time,
      isRecurring: r.is_recurring,
      recurrenceType: r.recurrence_type,
      recurrenceDays:
        r.recurrence_days == null
          ? null
          : typeof r.recurrence_days === 'string'
            ? r.recurrence_days
            : JSON.stringify(r.recurrence_days),
      price: r.price,
      tags: r.tags ?? [],
    }));
}

export interface JobPosting {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly requirements: string | null;
  readonly employment_type: string | null;
  readonly department: string | null;
  readonly salary_type: string | null;
  readonly salary_min: number | null;
  readonly salary_max: number | null;
  readonly status: string | null;
}

export async function getJobPostings(): Promise<readonly JobPosting[]> {
  const rows = await query<JobPosting>(
    `job_postings?restaurant_id=eq.${RESTAURANT_ID}&select=*&order=sort_order`,
  );
  return rows.filter((r) => r.status === null || r.status === 'open' || r.status === 'active');
}
