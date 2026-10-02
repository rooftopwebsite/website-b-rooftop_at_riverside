export interface GameDayDeal {
  readonly name: string;
  readonly how: string;
  readonly price: string;
}

export const GAME_DAY_DEALS: readonly GameDayDeal[] = [
  {
    name: '2 Minute Drill',
    how: 'Domestic drafts, from the two minute warning until halftime',
    price: '$3',
  },
  {
    name: 'Touchdown Shots',
    how: 'Fireball, Rumple Minze, Jägermeister or Four Roses, every time our team scores',
    price: '$4',
  },
  {
    name: 'The Tailgate',
    how: 'Five domestic beers and two shots, same list as Touchdown Shots',
    price: '$25',
  },
];

export const GAME_DAY_LABEL = 'Game day at the bar';

export const GAME_DAY_NOTE = 'Every football Sunday the bar adds three game day specials, on top of happy hour.';
