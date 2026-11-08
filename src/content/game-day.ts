export interface GameDayDeal {
  readonly name: string;
  readonly how: string;
  readonly price: string;
  readonly aliases?: readonly string[];
}

export const GAME_DAY_DEALS: readonly GameDayDeal[] = [
  { name: 'Pack-a-Rita', how: 'For Green Bay', price: '$15', aliases: ['Packer-ita', 'Packer-Rita'] },
  { name: 'Midway Smash', how: 'For Chicago', price: '$12' },
  { name: 'Lion’s Den', how: 'For Detroit', price: '$10' },
  { name: 'Gjallarhorn', how: 'For Minnesota', price: '$12' },
];

export const GAME_DAY_LABEL = 'Game day at the bar';

export const GAME_DAY_NOTE = 'Every football Sunday the bar adds game day specials, on top of happy hour.';
