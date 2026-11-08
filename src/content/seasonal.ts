/**
 * Seasonal switches. Flip a value and redeploy.
 *
 * NFC_NORTH_SUNDAYS: the NFC North Sundays block on /sunset-bar and its
 * "More" menu card. Set to false after football season; set back to true
 * next September. It does not read or change any Sanity events.
 */
export const SEASONAL = {
  NFC_NORTH_SUNDAYS: true,
} as const;
