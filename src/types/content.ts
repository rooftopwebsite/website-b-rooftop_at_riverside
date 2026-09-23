export interface HappyHour {
  readonly days: string;
  readonly daysShort: string;
  readonly time: string;
  readonly deals: readonly { readonly price: string; readonly what: string }[];
  readonly note: string | null;
}

export interface Hours {
  readonly day: string;
  readonly bar: string;
  readonly trucks: string;
}

export interface Person {
  readonly name: string;
  readonly role: string;
  readonly email: string | null;
  readonly bio: string | null;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  readonly quote: string | null;
}

export interface VenueArea {
  readonly slug: string;
  readonly name: string;
  readonly floor: 'Ground floor' | 'Second floor';
  readonly body: string;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  readonly photoBrief: string;
  readonly href?: string;
}

export interface GiveBack {
  readonly title: string;
  readonly tiers: readonly number[];
  readonly body: string;
  readonly partner: string | null;
}
