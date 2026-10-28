export interface PageSeo {
  readonly h1: string;
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
}

export const PAGE_SEO = {
  '/': {
    h1: 'Eat, Drink, Paradise at Rooftop at Riverside in downtown Bonita Springs',
    title: 'Rooftop Bar & Food Truck Park in Bonita Springs, FL',
    description:
      'A rooftop bar over a yard of gourmet food trucks in downtown Bonita Springs. Live music, weekend happy hour and dogs welcome in the yard. Just come up.',
    keywords: ['rooftop bar bonita springs', 'food truck park'],
  },

  '/sunset-bar': {
    h1: "Bonita's only rooftop",
    title: 'Sunset Bar | The Only Rooftop Bar in Bonita Springs',
    description:
      'Craft cocktails, local drafts and the best west-facing seat in town. Weekend happy hour, and the whole rooftop looking at the sunset.',
    keywords: ['rooftop bar', 'happy hour bonita springs'],
  },

  '/food-trucks': {
    h1: 'Big flavors, out in the yard',
    title: 'Food Trucks | Bonita Springs Food Truck Park',
    description:
      'Gourmet food trucks in the yard at Rooftop at Riverside. Street tacos, seafood, American comfort classics and tropical fusion, with craft cocktails from the rooftop bar.',
    keywords: ['food trucks bonita springs', 'where to eat downtown'],
  },

  '/whats-on': {
    h1: "What's on this week",
    title: 'Events & Live Music | Rooftop at Riverside',
    description:
      'Live music, Bingo Night and Wooftop Fest in downtown Bonita Springs. See the calendar by month or by list, filter it, and add it to your own.',
    keywords: ['live music bonita springs tonight', 'things to do'],
  },

  '/events': {
    h1: 'Your event, two stories up',
    title: 'Private Event Venue in Bonita Springs | Rooftop at Riverside',
    description:
      'Rent the rooftop, the yard, or the whole place. Four food trucks, our own bar, and one person coordinating all of it. Downtown Bonita Springs.',
    keywords: ['private event venue bonita springs'],
  },









  '/market': {
    h1: 'Meet the makers',
    title: 'Neighborhood Market | Rooftop at Riverside',
    description:
      'Local makers set up in the yard with handmade goods, while the trucks cook and the bar stays open. Booths are $30, and you can apply online.',
    keywords: ['market bonita springs'],
  },

  '/our-story': {
    h1: 'A Magnus family project',
    title: 'Our Story | Rooftop at Riverside, Downtown Bonita Springs',
    description:
      'Four years of planning by a Bonita family. How a corner of Old 41 became a rooftop bar over a yard of gourmet food trucks, with the town’s own history on the walls.',
    keywords: [],
  },

  '/join-us': {
    h1: 'Work here, play here',
    title: 'Jobs & Live Music Bookings | Rooftop at Riverside',
    description:
      'Two ways in: we hire through here, and we book live music for the stage in the yard. Both start with a form that a person reads.',
    keywords: ['bonita springs bar jobs', 'live music booking bonita springs'],
  },



  '/blog': {
    h1: 'Stories from the Rooftop',
    title: 'Blog | Rooftop at Riverside, Downtown Bonita Springs',
    description:
      'Stories from the rooftop bar and food truck park in Downtown Bonita Springs: the music, the trucks, the game days and the people behind them.',
    keywords: [],
  },
  '/contact': {
    h1: 'Say hello to the rooftop',
    title: 'Contact | Rooftop at Riverside',
    description:
      'The address, the hours and a form that reaches the person who can answer it. Downtown Bonita Springs, across from Riverside Park.',
    keywords: [],
  },
  '/game-truck': {
    h1: 'Game night on wheels',
    title: 'Gaming Truck | Rooftop at Riverside, Bonita Springs',
    description:
      'Xbox Series X, PlayStation 5 and Nintendo Switch 2 on six screens with a Game Coach on site. $10 per person for 30 minutes, or a two hour party from $400.',
    keywords: [],
  },

  '/gaming-truck-policies': {
    h1: 'Gaming truck policies',
    title: 'Gaming Truck Policies & Procedures | Rooftop at Riverside',
    description:
      'Booking, deposits, cancellations, inclement weather, food and drink, alcohol, behavior and game ratings for the gaming truck at Rooftop at Riverside.',
    keywords: ['gaming truck cancellation policy', 'game truck party rules bonita springs'],
  },
  '/game-zone-waiver': {
    h1: 'Game zone waiver',
    title: 'Game Zone Waiver | Rooftop at Riverside',
    description:
      'The full terms for the gaming truck: assumption of risk, property damage, release of liability and the photography release. Read it before you sign.',
    keywords: ['game truck waiver'],
  },
  '/bar-games-waiver': {
    h1: 'Bar games waiver',
    title: 'Bar Games Waiver | Rooftop at Riverside',
    description:
      'Terms and conditions for the bar games at Rooftop at Riverside. Twenty one and over, no gambling, and the rules every player agrees to.',
    keywords: ['bar games terms and conditions'],
  },

  '/privacy-policy': {
    h1: 'Privacy policy',
    title: 'Privacy Policy | Rooftop at Riverside',
    description:
      'What Rooftop at Riverside collects through this site, why we collect it, who we share it with, and how to ask us to delete it.',
    keywords: [],
  },
  '/terms-of-service': {
    h1: 'Terms of service',
    title: 'Terms of Service | Rooftop at Riverside',
    description:
      'The terms for using rooftopatriverside.com, buying event tickets, booking a private event and visiting the venue.',
    keywords: [],
  },
  '/cookie-policy': {
    h1: 'Cookie policy',
    title: 'Cookie Policy | Rooftop at Riverside',
    description:
      'Which cookies rooftopatriverside.com sets, which ones come from third parties, and how to change what you allow.',
    keywords: [],
  },
  '/accessibility': {
    h1: 'Accessibility statement',
    title: 'Accessibility | Rooftop at Riverside',
    description:
      'How we build and test rooftopatriverside.com for accessibility, what is still missing, and how to tell us when something does not work.',
    keywords: [],
  },
} as const satisfies Record<string, PageSeo>;

export type SeoRoute = keyof typeof PAGE_SEO;

export const seo = (route: SeoRoute): PageSeo => PAGE_SEO[route];
