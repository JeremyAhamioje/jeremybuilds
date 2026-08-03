/**
 * Eight-point burst, generated rather than hand-plotted so the geometry is
 * exact and the spike ratio stays tunable. A small inner radius is what makes
 * it read as a sparkle instead of a cog.
 *
 * Shared: the date badge and the services header use the same mark, and two
 * hand-tuned copies would drift the first time either was adjusted.
 */
export function burstPath({ points = 8, outer = 12, inner = 3.4, centre = 12 } = {}) {
  const coords = []

  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = (Math.PI * i) / points - Math.PI / 2
    coords.push(
      `${(centre + radius * Math.cos(angle)).toFixed(2)},${(centre + radius * Math.sin(angle)).toFixed(2)}`,
    )
  }

  return `M${coords.join('L')}Z`
}

/** The default mark, at a 24x24 viewBox. */
export const STAR_PATH = burstPath()
