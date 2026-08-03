/**
 * PLACEHOLDER PROJECTS.
 *
 * Structure is real, content is not. Swap `asset` for the processed capture id
 * and fill in the copy — nothing else needs to change. Categories drive the
 * filter row, and their counts are derived rather than written down so they
 * cannot drift out of sync with the list.
 */

export const PROJECTS = [
  {
    id: 'project-01',
    asset: 'project-01',
    title: 'Placeholder Project One',
    summary:
      'A long-running collaboration turning a complex, technical site into a scalable platform.',
    categories: ['digital', 'branding'],
    year: '2025',
    href: '#work',
  },
  {
    id: 'project-02',
    asset: 'project-02',
    title: 'Placeholder Project Two',
    summary:
      'Identity and site for a small studio — voice, type system and build in one pass.',
    categories: ['branding'],
    year: '2025',
    href: '#work',
  },
  {
    id: 'project-03',
    asset: 'project-03',
    title: 'Placeholder Project Three',
    summary:
      'An interactive product surface built around motion, with a design system underneath it.',
    categories: ['digital', 'motion'],
    year: '2024',
    href: '#work',
  },
  {
    id: 'project-04',
    asset: 'project-04',
    title: 'Placeholder Project Four',
    summary:
      'A self-directed experiment in real-time rendering and scroll-driven storytelling.',
    categories: ['experiment', 'motion'],
    href: '#work',
    year: '2024',
  },
]

/** Filter definitions. `all` is synthetic and always first. */
export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'branding', label: 'Branding' },
  { id: 'digital', label: 'Digital' },
  { id: 'motion', label: 'Motion' },
  { id: 'experiment', label: 'Experiment' },
]

/**
 * Counts, derived from the list. Writing these by hand is how a filter row ends
 * up claiming five projects and showing three.
 */
export function countFor(categoryId) {
  if (categoryId === 'all') return PROJECTS.length
  return PROJECTS.filter((project) => project.categories.includes(categoryId)).length
}

export function filterProjects(categoryId) {
  if (categoryId === 'all') return PROJECTS
  return PROJECTS.filter((project) => project.categories.includes(categoryId))
}
