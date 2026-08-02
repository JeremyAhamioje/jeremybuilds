/**
 * LoadingManager — tracks real initialization work.
 *
 * Deliberately framework-agnostic and free of any presentation concern: it
 * knows about tasks and their weights, nothing about percentages on screen.
 * The preloader UI subscribes; a future interaction layer can subscribe to the
 * same snapshots without either of them touching this file.
 *
 * Design rules that matter here:
 *  - Progress reflects actual completed work, never a timer.
 *  - Reported progress is monotonic. Tasks can be registered mid-flight (the
 *    hero registers its assets after the shell boots) and a naive weighted
 *    average would visibly run backwards when the denominator grows.
 *  - There is always a path to a ready state. A failed non-critical task is
 *    recorded and ignored; a stalled load trips a timeout into DEGRADED.
 *    The user is never trapped behind the loader.
 */

/** @enum {string} */
export const LoadingState = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  /** All critical work settled — the hero can be prepared. */
  CRITICAL_READY: 'CRITICAL_READY',
  PREPARING_REVEAL: 'PREPARING_REVEAL',
  READY: 'READY',
  REVEALING: 'REVEALING',
  /** Revealed; non-critical work may still be in flight. */
  BACKGROUND_LOADING: 'BACKGROUND_LOADING',
  COMPLETE: 'COMPLETE',
  /** Entered via timeout or critical failure. Usable, with something missing. */
  DEGRADED: 'DEGRADED',
}

/** @enum {string} */
export const TaskStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETE: 'complete',
  FAILED: 'failed',
}

const SETTLED = new Set([TaskStatus.COMPLETE, TaskStatus.FAILED])

/**
 * @param {object} [options]
 * @param {number} [options.criticalTimeoutMs] - hard ceiling on critical work.
 * @param {(message: string, detail?: unknown) => void} [options.onDiagnostic]
 */
export function createLoadingManager(options = {}) {
  const { criticalTimeoutMs = 12000, onDiagnostic } = options

  /** @type {Map<string, {id:string,weight:number,critical:boolean,label:string,status:string,error:unknown}>} */
  const tasks = new Map()
  const listeners = new Set()
  const failures = []

  let state = LoadingState.INITIALIZING
  let startedAt = 0
  let timeoutId = null
  let disposed = false

  /**
   * Monotonic guards — a progress bar must never run backwards, even though
   * tasks get registered mid-flight (the hero registers assets after boot).
   *
   * These latch only NON-VACUOUS measurements. An empty category reports 1
   * ("nothing to wait for"), and latching that would pin the category at 100%
   * forever the moment its first real task arrived.
   */
  let criticalLatch = 0
  let backgroundLatch = 0
  let reportedProgress = 0
  let reportedBackground = 0

  let snapshot = buildSnapshot()

  /* --------------------------------------------------------------- internals */

  /**
   * Weighted completion of one category.
   * @returns {{value:number, vacuous:boolean}} `vacuous` when the category is
   *   empty — "nothing left to do", which must not be latched as real progress.
   */
  function weigh(predicate) {
    let total = 0
    let done = 0
    let count = 0

    for (const task of tasks.values()) {
      if (!predicate(task)) continue
      count += 1
      total += task.weight
      if (SETTLED.has(task.status)) done += task.weight
    }

    if (count === 0) return { value: 1, vacuous: true }
    return { value: done / total, vacuous: false }
  }

  function criticalSettled() {
    for (const task of tasks.values()) {
      if (task.critical && !SETTLED.has(task.status)) return false
    }
    return true
  }

  /** Label of whatever critical work is currently in flight, for the UI. */
  function activeLabel() {
    let firstPending = null

    for (const task of tasks.values()) {
      if (!task.critical || SETTLED.has(task.status)) continue
      if (task.status === TaskStatus.RUNNING) return task.label
      if (!firstPending) firstPending = task.label
    }

    return firstPending
  }

  function buildSnapshot() {
    return {
      state,
      /** 0..1 across critical work only — this is what the bar shows. */
      progress: reportedProgress,
      /** 0..1 across non-critical work, continuing after reveal. */
      backgroundProgress: reportedBackground,
      criticalReady: criticalSettled(),
      label: activeLabel(),
      elapsedTime: startedAt === 0 ? 0 : performance.now() - startedAt,
      failures: [...failures],
      degraded: state === LoadingState.DEGRADED || failures.length > 0,
    }
  }

  function emit() {
    if (disposed) return

    const critical = weigh((t) => t.critical)
    const background = weigh((t) => !t.critical)

    if (!critical.vacuous) criticalLatch = Math.max(criticalLatch, critical.value)
    if (!background.vacuous) backgroundLatch = Math.max(backgroundLatch, background.value)

    reportedProgress = critical.vacuous ? 1 : criticalLatch
    reportedBackground = background.vacuous ? 1 : backgroundLatch

    snapshot = buildSnapshot()
    for (const listener of listeners) listener(snapshot)
  }

  function advanceIfCriticalSettled() {
    if (state !== LoadingState.LOADING) return
    if (!criticalSettled()) return

    clearTimer()
    state = failures.some((f) => f.critical) ? LoadingState.DEGRADED : LoadingState.CRITICAL_READY
  }

  function clearTimer() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  function diagnose(message, detail) {
    if (onDiagnostic) onDiagnostic(message, detail)
  }

  /* ------------------------------------------------------------------ public */

  const manager = {
    LoadingState,

    /**
     * Declare a unit of work. Safe to call after start() — the hero registers
     * its assets once it mounts.
     *
     * @param {object} task
     * @param {string} task.id
     * @param {string} task.label - shown while this task is in flight
     * @param {number} [task.weight] - relative cost; weigh a texture above a font
     * @param {boolean} [task.critical] - must settle before reveal
     */
    registerTask({ id, label, weight = 1, critical = true }) {
      if (tasks.has(id)) {
        diagnose(`Task "${id}" registered twice; keeping the original.`)
        return manager
      }

      tasks.set(id, { id, label, weight, critical, status: TaskStatus.PENDING, error: null })
      emit()
      return manager
    },

    startTask(id) {
      const task = tasks.get(id)
      if (!task || SETTLED.has(task.status)) return manager

      task.status = TaskStatus.RUNNING
      emit()
      return manager
    },

    completeTask(id) {
      const task = tasks.get(id)
      if (!task || SETTLED.has(task.status)) return manager

      task.status = TaskStatus.COMPLETE
      advanceIfCriticalSettled()
      emit()
      return manager
    },

    /**
     * Record a failure and keep going. Failing is never fatal here — a missing
     * background image should not cost the visitor the whole page.
     */
    failTask(id, error) {
      const task = tasks.get(id)
      if (!task || SETTLED.has(task.status)) return manager

      task.status = TaskStatus.FAILED
      task.error = error
      failures.push({ id, critical: task.critical, error })
      diagnose(`Task "${id}" failed`, error)

      advanceIfCriticalSettled()
      emit()
      return manager
    },

    /**
     * Register-and-run convenience. Resolves to the task's value, or null if it
     * failed — callers decide whether a null matters to them.
     *
     * @template T
     * @param {object} task - same shape as registerTask
     * @param {() => Promise<T>} work
     * @returns {Promise<T|null>}
     */
    async run(task, work) {
      manager.registerTask(task)
      manager.startTask(task.id)

      try {
        const value = await work()
        manager.completeTask(task.id)
        return value
      } catch (error) {
        manager.failTask(task.id, error)
        return null
      }
    },

    /** Begin timing and arm the timeout. Idempotent. */
    start() {
      if (state !== LoadingState.INITIALIZING) return manager

      state = LoadingState.LOADING
      startedAt = performance.now()

      // Safety net: never leave the visitor stuck behind the loader.
      timeoutId = setTimeout(() => {
        if (criticalSettled()) return

        const stalled = [...tasks.values()]
          .filter((t) => t.critical && !SETTLED.has(t.status))
          .map((t) => t.id)

        diagnose(`Critical load timed out after ${criticalTimeoutMs}ms`, stalled)
        for (const id of stalled) manager.failTask(id, new Error('timeout'))

        state = LoadingState.DEGRADED
        emit()
      }, criticalTimeoutMs)

      // A manager started with no critical tasks is already ready.
      advanceIfCriticalSettled()
      emit()
      return manager
    },

    /** Hero is building its scene / warming up before we pull the curtain. */
    prepareReveal() {
      if (state !== LoadingState.CRITICAL_READY && state !== LoadingState.DEGRADED) return manager
      state = LoadingState.PREPARING_REVEAL
      emit()
      return manager
    },

    markReady() {
      state = LoadingState.READY
      emit()
      return manager
    },

    beginReveal() {
      state = LoadingState.REVEALING
      emit()
      return manager
    },

    /** Curtain is gone; anything still in flight is background work. */
    completeReveal() {
      const backgroundPending = [...tasks.values()].some(
        (t) => !t.critical && !SETTLED.has(t.status),
      )

      state = backgroundPending ? LoadingState.BACKGROUND_LOADING : LoadingState.COMPLETE
      emit()
      return manager
    },

    getSnapshot() {
      return snapshot
    },

    /** @param {(snapshot: object) => void} listener */
    subscribe(listener) {
      listeners.add(listener)
      listener(snapshot)
      return () => listeners.delete(listener)
    },

    dispose() {
      clearTimer()
      listeners.clear()
      disposed = true
    },
  }

  return manager
}
