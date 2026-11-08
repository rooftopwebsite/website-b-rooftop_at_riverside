export const NFC_NORTH_HEADING = 'NFC North Sundays at Rooftop';

export const NFC_NORTH_EYEBROW = 'Every Sunday of the season';

export const NFC_NORTH_LEAD =
  'Make Sunset Bar your Sunday football spot in Downtown Bonita Springs. Enjoy the open-air breeze, your favorite drinks, and the excitement of NFC North football with the 1 PM and 4:30 PM games on every screen upstairs. Whether you’re a lifelong Packers, Bears, Lions, or Vikings fan, or your loyalty lies elsewhere, there’s a place for you at Rooftop.';

export const GIVEAWAY_HEADING = 'Weekly Giveaways & Grand Prize Drawing';

export const GIVEAWAY_STEPS = [
  {
    title: 'One ticket per check',
    body: 'Close your check, get a raffle ticket and drop it in your team’s bucket.',
  },
  {
    title: 'Weekly prizes',
    body: 'Every Sunday there is a giveaway for each team in the division.',
  },
  {
    title: 'Rollover entries',
    body: 'Every entry rolls into the Week 18 grand prize drawing.',
  },
] as const;

export const GIVEAWAY_JERSEY_INTRO =
  'The Week 18 drawing gives away a Beckett Witnessed autographed jersey for each team:';

export const GIVEAWAY_JERSEYS = [
  { team: 'Packers', player: 'Jordan Love' },
  { team: 'Bears', player: 'Colston Loveland' },
  { team: 'Lions', player: 'Amon-Ra St. Brown' },
  { team: 'Vikings', player: 'Justin Jefferson' },
] as const;

export const SPECIALS_HEADING = 'Sunday cocktail specials';

export const SPECIALS_NOTE = 'Every football Sunday, on top of happy hour.';

export interface SundaySpecial {
  readonly name: string;
  readonly price: string;
  readonly team: string;
  readonly description: string;
}

export const SUNDAY_SPECIALS: readonly SundaySpecial[] = [
  {
    name: 'Pack-a-Rita',
    price: '$15',
    team: 'For the Packers',
    description:
      'A Title Town twist on a margarita with tequila, fresh lime, agave and Triple Sec. Finished in Packers green.',
  },
  {
    name: 'Midway Smash',
    price: '$12',
    team: 'For the Bears',
    description:
      'A Chicago-inspired citrus smash with vodka, muddled oranges, soda and a refreshing orange finish.',
  },
  {
    name: 'Lion’s Den',
    price: '$10',
    team: 'For the Lions',
    description: 'A bold blue blend of Tito’s vodka, blue curaçao, citrus and lemonade.',
  },
  {
    name: 'Gjallarhorn',
    price: '$12',
    team: 'For the Vikings',
    description:
      'A purple-and-gold-inspired mix of Tito’s vodka, citrus, pineapple, blue curaçao and a sweet finish.',
  },
];

export const WHATS_HAPPENING_NOTE =
  'Football’s just part of the fun. Check out what’s coming up at Rooftop.';

export const WHATS_HAPPENING_CTA = 'See What’s Happening';
