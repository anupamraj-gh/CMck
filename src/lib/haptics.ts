/** Fires a short vibration where supported (Android Chrome/Firefox). No-ops everywhere else
 * (iOS Safari and desktop browsers don't implement the Vibration API) — safe to call freely. */
export function triggerHaptic(pattern: number | number[] = 10): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern)
  }
}
