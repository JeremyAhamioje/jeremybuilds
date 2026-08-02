/**
 * Registers the shell's genuinely-real critical work.
 *
 * Everything here corresponds to something the browser actually has to finish
 * before the hero can be shown. Hero assets are NOT registered here — the hero
 * registers its own in Phase 2, which is exactly the extensibility the loading
 * architecture exists to provide.
 */

/**
 * @param {ReturnType<import('./LoadingManager.js').createLoadingManager>} manager
 */
export function registerShellTasks(manager) {
  // Web fonts. `document.fonts.ready` settles once font loading is done, so
  // this is real work — and it prevents a text reflow during the reveal.
  manager.run(
    { id: 'fonts', label: 'typography', weight: 1 },
    () => (document.fonts ? document.fonts.ready : Promise.resolve()),
  )

  // First paint of the app shell. Two rAFs guarantees the browser has laid out
  // and painted at least one frame, rather than merely executing our JS.
  manager.run(
    { id: 'app-shell', label: 'interface', weight: 1 },
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      }),
  )

  registerDevLoadSimulation(manager)
}

/**
 * DEV ONLY — `?slowload=<ms>` adds one artificial task so the preloader's
 * states and transitions can actually be observed and verified.
 *
 * This is a test affordance, never the progress mechanism: it is opt-in via a
 * query parameter, stripped from production builds, and real tasks drive
 * progress whether or not it is present.
 */
function registerDevLoadSimulation(manager) {
  if (!import.meta.env.DEV) return

  const requested = new URLSearchParams(window.location.search).get('slowload')
  if (!requested) return

  const duration = Number(requested)
  if (!Number.isFinite(duration) || duration <= 0) return

  manager.run(
    { id: 'dev-slowload', label: 'simulated load', weight: 4 },
    () => new Promise((resolve) => setTimeout(resolve, duration)),
  )
}
