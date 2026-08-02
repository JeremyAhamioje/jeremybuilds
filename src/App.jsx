import Hero from './components/Hero/Hero.jsx'

/**
 * Minimal test harness for the hero experiment.
 *
 * Deliberately not a portfolio — just enough page for the hero to sit in and,
 * later, enough scroll length below it to drive the ScrollTrigger sequence.
 */
export default function App() {
  return (
    <main>
      <section className="hero">
        <Hero />
      </section>

      {/* Placeholder for whatever follows the hero — proves the exit lands somewhere. */}
      <section className="next-section">
        <p>next section</p>
      </section>
    </main>
  )
}
