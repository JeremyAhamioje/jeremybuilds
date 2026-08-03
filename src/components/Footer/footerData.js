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
 * `href: null` until the real profiles are supplied. Rendered as plain text
 * rather than as links, so nothing here is clickable-but-dead — a footer full
 * of `#` links is worse than a footer that simply lists where to find someone.
 * Fill in the URL and it becomes a link with no other change.
 */
export const SOCIALS = [
  { label: 'LinkedIn', href: null },
  { label: 'GitHub', href: null },
  { label: 'Twitter', href: null },
  { label: 'Instagram', href: null },
]

/**
 * Contact address.
 *
 * Defaults to the domain being connected rather than a personal inbox — a
 * portfolio should hand out an address that can be rotated or forwarded
 * without reprinting anything.
 */
export const CONTACT_EMAIL = 'hello@jeremybuilds.online'
