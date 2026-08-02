import { createLoadingManager, LoadingState } from './LoadingManager.js'

let passed = 0
let failed = 0
function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n        expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`}`)
  ok ? passed++ : failed++
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ------------------------------------------------ weighted progress */
console.log('\nweighted progress')
{
  const m = createLoadingManager()
  m.registerTask({ id: 'light', label: 'a', weight: 1 })
  m.registerTask({ id: 'heavy', label: 'b', weight: 9 })
  m.start()
  check('starts at 0', m.getSnapshot().progress, 0)
  m.completeTask('light')
  check('light task moves 10%', +m.getSnapshot().progress.toFixed(2), 0.1)
  m.completeTask('heavy')
  check('reaches 1', m.getSnapshot().progress, 1)
  check('critical ready', m.getSnapshot().criticalReady, true)
  check('state advanced', m.getSnapshot().state, LoadingState.CRITICAL_READY)
}

/* ------------------------------------------------ failure is survivable */
console.log('\nfailure handling')
{
  const m = createLoadingManager()
  m.registerTask({ id: 'ok', label: 'a' })
  m.registerTask({ id: 'broken', label: 'b' })
  m.start()
  m.completeTask('ok')
  m.failTask('broken', new Error('404'))
  const s = m.getSnapshot()
  check('still reaches full progress', s.progress, 1)
  check('critical ready despite failure', s.criticalReady, true)
  check('enters DEGRADED, not stuck', s.state, LoadingState.DEGRADED)
  check('failure recorded', s.failures.length, 1)
}

/* ------------------------------------------------ non-critical never blocks */
console.log('\ncritical vs background')
{
  const m = createLoadingManager()
  m.registerTask({ id: 'crit', label: 'a', critical: true })
  m.registerTask({ id: 'bg', label: 'b', critical: false })
  m.start()
  m.completeTask('crit')
  const s = m.getSnapshot()
  check('critical ready with background pending', s.criticalReady, true)
  check('critical progress full', s.progress, 1)
  check('background still incomplete', s.backgroundProgress, 0)
  m.completeReveal()
  check('reveal -> BACKGROUND_LOADING', m.getSnapshot().state, LoadingState.BACKGROUND_LOADING)
  m.completeTask('bg')
  check('background completes', m.getSnapshot().backgroundProgress, 1)
}

/* ------------------------------------------------ monotonic progress */
console.log('\nmonotonic progress (tasks registered mid-flight)')
{
  const m = createLoadingManager()
  m.registerTask({ id: 'a', label: 'a' })
  m.start()
  m.completeTask('a')
  const before = m.getSnapshot().progress
  check('full before new work arrives', before, 1)
  // The hero registers its assets after the shell booted.
  m.registerTask({ id: 'late1', label: 'late', weight: 5 })
  m.registerTask({ id: 'late2', label: 'late', weight: 5 })
  const after = m.getSnapshot().progress
  check('never runs backwards', after >= before, true)
}

/* ------------------------------------------------ timeout safety */
console.log('\ntimeout safety')
{
  const m = createLoadingManager({ criticalTimeoutMs: 250, onDiagnostic: () => {} })
  m.registerTask({ id: 'stalled', label: 'never resolves' })
  m.start()
  check('blocked initially', m.getSnapshot().criticalReady, false)
  await sleep(400)
  const s = m.getSnapshot()
  check('timeout releases the visitor', s.criticalReady, true)
  check('marked DEGRADED', s.state, LoadingState.DEGRADED)
  check('stall recorded as failure', s.failures.length, 1)
}

/* ------------------------------------------------ run() helper */
console.log('\nrun() helper')
{
  const m = createLoadingManager()
  m.start()
  const good = await m.run({ id: 'g', label: 'g' }, async () => 'value')
  check('resolves to the value', good, 'value')
  const bad = await m.run({ id: 'b', label: 'b' }, async () => {
    throw new Error('nope')
  })
  check('failure resolves to null, does not throw', bad, null)
  check('progress still complete', m.getSnapshot().progress, 1)
}

/* ------------------------------------------------ empty manager */
console.log('\nno tasks at all')
{
  const m = createLoadingManager()
  m.start()
  check('immediately ready, not 0%', m.getSnapshot().progress, 1)
  check('state advances', m.getSnapshot().state, LoadingState.CRITICAL_READY)
}

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
