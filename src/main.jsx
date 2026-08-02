import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

/*
 * Self-hosted typefaces, bundled by Vite so they get content-hashed filenames
 * and no third-party request sits in the critical path.
 *
 * THE STACK — three voices, deliberately in tension:
 *
 *   Big Shoulders Display  monumental condensed. Carries the headline; tall and
 *                          narrow enough to read as a poster, not a web heading.
 *   Instrument Serif       editorial high-contrast serif. Name, eyebrow and the
 *                          italic asides that stop the page reading as pure sans.
 *   Archivo Variable       grotesque workhorse for body and UI. Loaded on its
 *                          `wdth` axis (62-125%) as well as weight, which is what
 *                          lets the date numerals be a genuinely wide, heavy cut
 *                          rather than a horizontally stretched normal one.
 *
 * Imported from JS rather than via CSS `@import`: PostCSS resolves bare
 * specifiers against the project root, not node_modules, so the CSS form fails.
 * Specifiers are extensionless because the packages map `./*` -> `./*.css`, and
 * big-shoulders-display omits the `./*.css` key the other two happen to carry.
 * The browser still only fetches the latin subsets — the @font-face rules carry
 * unicode-range.
 */
import '@fontsource-variable/archivo/wdth'
import '@fontsource-variable/big-shoulders-display/wght'
import '@fontsource/instrument-serif/latin-400'
import '@fontsource/instrument-serif/latin-400-italic'

import './styles/tokens.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
