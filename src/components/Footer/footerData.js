/**
 * Footer content.
 *
 * The interests read as a person rather than a service list — the services
 * section already sells; this is the part that makes someone want to write.
 * "Art" sits in the middle of the list on purpose: the whole site is built on
 * a Renaissance fresco, so claiming it as an interest is the payoff for the
 * imagery rather than a decoration on top of it.
 */
export const INTERESTS = [
  'UX/UI Design',
  'Full-Stack Development',
  'AI Integration',
  'Art',
  'Creative Development',
  'New Businesses',
  'Startups',
  // The reference ends on "Pizza". Swap this for whatever the real answer is —
  // the joke only works if it is actually yours.
  'Jollof',
]

/**
 * Social links.
 *
 * `href: null` renders as plain text rather than a `#` link, so nothing here
 * is ever clickable-but-dead. Twitter and Instagram are still waiting on real
 * profile URLs; adding one turns it into a link with no other change.
 */
export const SOCIALS = [
  /*
   * A lnkd.in shortener, as supplied. It works, but it is worth replacing with
   * the full /in/<vanity> URL when convenient: a shortener is opaque on hover,
   * adds a redirect hop, and is a third party that can go down between someone
   * reading this footer and reaching the profile.
   */
  { label: 'LinkedIn', href: 'https://lnkd.in/ed-skQwd' },
  { label: 'GitHub', href: 'https://github.com/JeremyAhamioje' },
  { label: 'Twitter', href: null },
  { label: 'Instagram', href: null },
]

/** Contact address. */
export const CONTACT_EMAIL = 'ahamiojejeremy@gmail.com'
