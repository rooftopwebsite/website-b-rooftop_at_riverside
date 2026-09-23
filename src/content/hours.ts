import type { Hours } from '@/types/content';

export const HOURS: readonly Hours[] = [
  { day: 'Monday', bar: 'Closed', trucks: 'Closed' },
  { day: 'Tuesday', bar: 'Closed', trucks: 'Closed' },
  { day: 'Wednesday', bar: '3:00 PM – 8:00 PM', trucks: '4:00 PM – 8:00 PM' },
  { day: 'Thursday', bar: '3:00 PM – 8:00 PM', trucks: '4:00 PM – 8:00 PM' },
  { day: 'Friday', bar: '3:00 PM – 12:00 AM', trucks: '4:00 PM – 11:00 PM' },
  { day: 'Saturday', bar: '11:00 AM – 2:00 AM', trucks: '12:00 PM – 11:00 PM' },
  { day: 'Sunday', bar: '11:00 AM – 8:00 PM', trucks: '12:00 PM – 8:00 PM' },
];

export const HOURS_SCHEMA = [
  'We 15:00-20:00',
  'Th 15:00-20:00',
  'Fr 15:00-24:00',
  'Sa 11:00-02:00',
  'Su 11:00-20:00',
] as const;

export const todayIndex = (): number => {
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
  );
  return (now.getDay() + 6) % 7;
};
