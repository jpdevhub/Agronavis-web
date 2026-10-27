/** Every outbound destination, in one place so none of them drift. */
export const LINKS = {
  play: 'https://play.google.com/store/apps/details?id=com.agronavis.app',
  instagram: 'https://www.instagram.com/agronavis8/',
  youtube: 'https://www.youtube.com/@techcraftersco8bn418',
  email: 'contact@agronavis.in',
} as const;

/** Adds campaign tags so installs can be attributed to where they came from. */
export const playUrl = (source: string) =>
  `${LINKS.play}&referrer=${encodeURIComponent(`utm_source=website&utm_medium=referral&utm_campaign=${source}`)}`;
