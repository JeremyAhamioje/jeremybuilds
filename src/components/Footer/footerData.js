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
   * The tracking parameters that came with the shared URL
   * (?utm_source=share_via&utm_content=profile&utm_medium=member_ios) are
   * stripped. They describe how the link was copied out of the iOS app, not
   * anything about a visitor arriving from here, so they would only tell
   * LinkedIn that every single visit came from an iPhone share sheet.
   */
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jeremy-ahamioje-42b56725a' },
  { label: 'GitHub', href: 'https://github.com/JeremyAhamioje' },
  { label: 'Twitter', href: null },
  { label: 'Instagram', href: null },
]

/** Contact address. */
export const CONTACT_EMAIL = 'ahamiojejeremy@gmail.com'

/**
 * WhatsApp.
 *
 * `wa.me` takes a number in full international form with no `+`, no spaces and
 * no leading zero. The local number is 0806 670 4987; the leading 0 is the
 * national trunk prefix and is REPLACED by the country code, not appended to
 * it — so 234 + 8066704987. Passing the local form does not error, it just
 * opens a dead chat, which is the kind of failure nobody notices until a lead
 * has already given up.
 */
const WHATSAPP_NUMBER = '2348066704987'

/** Pre-filled so the first message costs the visitor nothing to write. */
const WHATSAPP_MESSAGE = 'Hi Jeremy — I saw your portfolio and would like to talk about a project.'

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`
