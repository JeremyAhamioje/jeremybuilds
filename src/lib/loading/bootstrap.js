/**
 * Declares every piece of critical work, up front.
 *
 * The full critical set is declared here rather than letting components
 * register themselves as they mount. Late registration works — progress is
 * monotonic and would not run backwards — but it makes the bar's meaning depend
 * on React's effect ordering: if the shell's own tasks settled before the hero
 * mounted, critical progress would already read 100% while the artwork was
 * still downloading. A declared manifest keeps the percentage honest.
 *
 * Components still own their own COMPLETION. The hero calls completeTask once
 * each image has genuinely decoded; if the hero never mounts, the timeout
 * catches it. Background (non-critical) work can still register dynamically.
 *
 * @param {ReturnType<import('./LoadingManager.js').createLoadingManager>} manager
 */
export function registerCriticalTasks(manager) {
  registerShellTasks(manager)
  registerHeroAssetTasks(manager)
}

/**
 * The two arm images. Weighted well above the shell tasks because they are the
 * actual transfer cost — a font check settling instantly should not imply the
 * artwork is a third of the way there.
 */
function registerHeroAssetTasks(manager) {
  manager.registerTask({ id: 'arm-b', label: 'artwork', weight: 5 })
  manager.registerTask({ id: 'arm-a', label: 'artwork', weight: 5 })

  /*
   * Marked in flight here, not by the hero.
   *
   * The hero used to call startTask itself, and it silently did nothing: React
   * runs child effects BEFORE parent effects, so the hero's effect fired before
   * this manifest existed, and startTask on an unregistered id returns without
   * a word. The arms went straight from PENDING to COMPLETE and were never
   * RUNNING — so the status line could never say "artwork", even though the two
   * images are ten of the twelve units of critical weight and are downloading
   * the whole time. The preloader read "typography" for almost the entire load.
   *
   * Doing it here is also more truthful than the hero doing it: the browser
   * starts fetching both images the moment the <picture> elements commit, which
   * is this same tick. They are in flight from the start.
   *
   * The hero still owns COMPLETION — only it knows when an image has decoded.
   */
  manager.startTask('arm-b')
  manager.startTask('arm-a')
}

function registerShellTasks(manager) {
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
