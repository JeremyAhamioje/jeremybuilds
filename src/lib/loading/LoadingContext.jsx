import { createContext, useContext, useMemo, useEffect, useSyncExternalStore } from 'react'
import { createLoadingManager } from './LoadingManager.js'

const LoadingContext = createContext(null)

/**
 * Provides one LoadingManager to the tree.
 *
 * Any component can register its own work without prop drilling — the hero
 * registers its image assets in Phase 2 through `useLoadingManager()`.
 */
export function LoadingProvider({ children, options }) {
  const manager = useMemo(() => createLoadingManager(options), [options])

  /*
   * Deliberately NOT disposed on unmount.
   *
   * The manager is created during render (useMemo) but an effect cleanup runs
   * on StrictMode's mount -> cleanup -> remount probe. Tearing it down there is
   * asymmetric with its setup: the probe would permanently dispose the live
   * manager, every later emit would silently no-op, and the loader would freeze
   * at 0%. That is a real remount bug, not just a dev-mode artifact.
   *
   * Nothing meaningful leaks by omitting it: the only timer is the critical
   * timeout, which the manager already clears the moment critical work settles.
   * If the tree unmounts mid-load, one timer fires against a detached object
   * with no subscribers and is collected. `dispose()` remains public for tests
   * and non-React consumers.
   */

  // Dev handle for inspecting load state from the console / automation.
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined
    window.__loadingManager = manager
    return () => {
      delete window.__loadingManager
    }
  }, [manager])

  return <LoadingContext.Provider value={manager}>{children}</LoadingContext.Provider>
}

/** The manager itself — for registering and completing tasks. */
export function useLoadingManager() {
  const manager = useContext(LoadingContext)
  if (!manager) throw new Error('useLoadingManager must be used inside a LoadingProvider')
  return manager
}

/**
 * Subscribe to loading state.
 *
 * `useSyncExternalStore` is the correct primitive here: the manager is an
 * external store, and its snapshot is referentially stable between changes, so
 * this re-renders only when something actually happened — not per frame.
 * Progress is a discrete event stream, never a per-frame value.
 */
export function useLoadingSnapshot() {
  const manager = useLoadingManager()

  return useSyncExternalStore(
    (onChange) => manager.subscribe(onChange),
    () => manager.getSnapshot(),
  )
}
