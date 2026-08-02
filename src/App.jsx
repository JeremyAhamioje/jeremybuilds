import { useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero/Hero.jsx'
import Preloader from './components/Preloader/Preloader.jsx'
import { PRELOADER_CONFIG } from './components/Preloader/preloaderConfig.js'
import { LoadingProvider, useLoadingManager } from './lib/loading/LoadingContext.jsx'
import { registerCriticalTasks } from './lib/loading/bootstrap.js'

/**
 * Minimal test harness for the hero experiment.
 *
 * Deliberately not a portfolio — just enough page for the hero to sit in and
 * enough scroll length below it to drive the interaction.
 */
export default function App() {
  const loadingOptions = useMemo(
    () => ({
      criticalTimeoutMs: PRELOADER_CONFIG.criticalTimeoutMs,
      onDiagnostic: (message, detail) => console.warn(`[loading] ${message}`, detail ?? ''),
    }),
    [],
  )

  return (
    <LoadingProvider options={loadingOptions}>
      <AppShell />
    </LoadingProvider>
  )
}

function AppShell() {
  const manager = useLoadingManager()
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    registerCriticalTasks(manager)
    manager.start()
  }, [manager])

  return (
    <>
      <Preloader onRevealed={() => setRevealed(true)} />

      {/*
        The hero mounts underneath the curtain rather than after it, so its own
        initialization counts as real loading work once Phase 2 wires it in.
        inert keeps it out of the tab order while the preloader is up.
      */}
      <main className="app" inert={revealed ? undefined : ''}>
        <section className="hero">
          <Hero />
        </section>

        {/* Placeholder for whatever follows — proves the hero's exit lands somewhere. */}
        <section className="next-section">
          <p>next section</p>
        </section>
      </main>
    </>
  )
}
