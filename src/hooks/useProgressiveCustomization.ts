import { useCallback, useState } from 'react'
import type { CustomizationGroup } from '@/types'
import { isGroupSelectionComplete } from '@/store/cartStore'

export type GroupDisclosureStatus = 'locked' | 'active' | 'completed' | 'optional'

export interface ProgressiveCustomizationController {
  /** 'locked' | 'active' | 'completed' for required groups (the auto-advancing chain), 'optional'
   * for everything else. */
  getStatus: (group: CustomizationGroup) => GroupDisclosureStatus
  isExpanded: (group: CustomizationGroup) => boolean
  /** Whether the group's header can be clicked to open/close it — true for a completed required
   * group (reopen to edit) and any optional group, false for the active group (nothing to toggle,
   * it's already open) and locked groups (not yet reachable). */
  canToggle: (group: CustomizationGroup) => boolean
  toggleGroup: (groupId: string) => void
  /** Call whenever a group's own selection changes, so the auto-advance chain knows this group
   * has been actively worked on — as opposed to merely holding its pre-filled default value. */
  markTouched: (groupId: string) => void
  /** Whether every required group in the chain is done — i.e. there's no longer an "active" group
   * waiting on the customer. Optional groups don't factor in, since they were never part of the
   * chain to begin with. */
  isConfigurationComplete: boolean
}

/**
 * Drives progressive disclosure across a product's customization groups — no accordion library,
 * just plain state plus conditional rendering, the same recipe as the guided checkout's step flow.
 *
 * Required groups form a single auto-advancing chain, and its whole state — which group is
 * "active", which are "completed", which are still "locked" — is *derived fresh on every render*
 * from three things: the product's own group order, which groups have been touched, and whether
 * each touched group's current selection is valid. The active group is simply the first required
 * group, in order, that isn't yet done. Nothing about that is cached or accumulated in state, so
 * there's no separate "mark complete" step that can go stale:
 *
 *   - Required group incomplete → it's the first not-done group, so it (and only it) is active;
 *     nothing after it can be reached, which is exactly what "prevent progression" means here.
 *   - Required group complete → the *next* required group becomes the first not-done one, so it
 *     automatically becomes active — no explicit "advance" call needed.
 *   - Editing an earlier, already-completed group is automatically revalidated on the very next
 *     render: if the edit leaves it valid, nothing downstream changes (their own selections were
 *     never touched, so they're preserved exactly as they were — nothing to reset). If the edit
 *     makes it invalid again (relevant for a *required* checkbox group, which can go from having a
 *     selection to having none), it stops counting as done, so it — not whatever was active a
 *     moment ago — becomes the active group again, exactly matching "prevent progression."
 *
 * Only "touched" needs to be real, persisted state: every required radio/select group already
 * carries a valid pre-filled default (see `buildDefaultSelections`), so treating raw validity alone
 * as "done" would collapse the entire chain the instant the page mounts, before the customer ever
 * saw it. Nothing about cart-gating validity (`isGroupSelectionComplete`,
 * `areRequiredSelectionsComplete`) changes — this hook never writes to `selections`, so it can
 * never itself invalidate or reset a choice; it only decides what to show.
 *
 * Optional groups never join the chain — they start collapsed and can be freely toggled open or
 * closed at any time, independent of where the required chain currently stands.
 */
export function useProgressiveCustomization(
  groups: CustomizationGroup[],
  selections: Record<string, string | string[]>,
): ProgressiveCustomizationController {
  const requiredGroupIds = groups.filter((g) => g.required).map((g) => g.id)

  const [touchedGroupIds, setTouchedGroupIds] = useState<Set<string>>(() => new Set())
  const [manuallyOpenGroupIds, setManuallyOpenGroupIds] = useState<Set<string>>(() => new Set())

  const markTouched = useCallback((groupId: string) => {
    setTouchedGroupIds((prev) => (prev.has(groupId) ? prev : new Set(prev).add(groupId)))
  }, [])

  const isDone = useCallback(
    (groupId: string): boolean => {
      const group = groups.find((g) => g.id === groupId)
      if (!group) return false
      return touchedGroupIds.has(groupId) && isGroupSelectionComplete(group, selections)
    },
    [groups, touchedGroupIds, selections],
  )

  // Revalidated on every render — the first required group (in order) that isn't done. If none
  // are left, the chain is fully complete and nothing is "active" anymore.
  const activeRequiredGroupId = requiredGroupIds.find((id) => !isDone(id)) ?? null

  const getStatus = useCallback(
    (group: CustomizationGroup): GroupDisclosureStatus => {
      if (!group.required) return 'optional'
      if (group.id === activeRequiredGroupId) return 'active'
      if (isDone(group.id)) return 'completed'
      return 'locked'
    },
    [activeRequiredGroupId, isDone],
  )

  const isExpanded = useCallback(
    (group: CustomizationGroup): boolean => {
      const status = getStatus(group)
      if (status === 'active') return true
      if (status === 'locked') return false
      return manuallyOpenGroupIds.has(group.id)
    },
    [getStatus, manuallyOpenGroupIds],
  )

  const canToggle = useCallback(
    (group: CustomizationGroup): boolean => {
      const status = getStatus(group)
      return status === 'completed' || status === 'optional'
    },
    [getStatus],
  )

  const toggleGroup = useCallback((groupId: string) => {
    setManuallyOpenGroupIds((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }, [])

  return {
    getStatus,
    isExpanded,
    canToggle,
    toggleGroup,
    markTouched,
    isConfigurationComplete: activeRequiredGroupId === null,
  }
}
