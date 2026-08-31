import { useCallback, useState } from 'react'

export type CheckoutStepId = 'customer' | 'delivery' | 'summary' | 'whatsapp'

export const CHECKOUT_STEPS: CheckoutStepId[] = ['customer', 'delivery', 'summary', 'whatsapp']

export interface UseCheckoutFlowOptions {
  /** Reports whether a given step's own data currently looks valid — read-only, sets no error
   * state. The checkout page's existing submit-time `validate()` is untouched and remains the
   * real gate for placing an order; this is separate, additive bookkeeping that a future guided
   * (step-by-step) checkout experience can build on, without altering today's single-page form. */
  isStepValid: (step: CheckoutStepId) => boolean
}

export interface CheckoutFlowController {
  steps: CheckoutStepId[]
  currentStep: CheckoutStepId
  goToStep: (step: CheckoutStepId) => void
  goNext: () => void
  goBack: () => void
  isStepComplete: (step: CheckoutStepId) => boolean
  isFlowComplete: boolean
}

/**
 * The CheckoutFlow controller — current step, step validation, navigation, and completion state
 * for the checkout experience. This phase is architecture only: nothing in `CheckoutPage` yet
 * uses `currentStep` to hide or reorder sections (all four still render together, exactly as
 * before), so this hook has no visible effect today. It exists so a future phase can drive an
 * actual guided, step-by-step layout from the same controller without re-deriving this logic.
 */
export function useCheckoutFlow({ isStepValid }: UseCheckoutFlowOptions): CheckoutFlowController {
  const [currentStep, setCurrentStep] = useState<CheckoutStepId>(CHECKOUT_STEPS[0])
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStepId>>(() => new Set())

  const goToStep = useCallback((step: CheckoutStepId) => setCurrentStep(step), [])

  // Depends on `currentStep` (read via closure) and the caller-supplied `isStepValid`, so this
  // reference changes whenever either does — same as before, just memoized so it doesn't churn on
  // renders where neither actually changed.
  const goNext = useCallback(() => {
    if (!isStepValid(currentStep)) return

    setCompletedSteps((prev) => {
      if (prev.has(currentStep)) return prev
      const next = new Set(prev)
      next.add(currentStep)
      return next
    })

    const currentIndex = CHECKOUT_STEPS.indexOf(currentStep)
    if (currentIndex < CHECKOUT_STEPS.length - 1) {
      setCurrentStep(CHECKOUT_STEPS[currentIndex + 1])
    }
  }, [currentStep, isStepValid])

  const goBack = useCallback(() => {
    setCurrentStep((prev) => {
      const currentIndex = CHECKOUT_STEPS.indexOf(prev)
      return currentIndex > 0 ? CHECKOUT_STEPS[currentIndex - 1] : prev
    })
  }, [])

  const isStepComplete = useCallback((step: CheckoutStepId) => completedSteps.has(step), [completedSteps])
  const isFlowComplete = CHECKOUT_STEPS.every((step) => completedSteps.has(step))

  return {
    steps: CHECKOUT_STEPS,
    currentStep,
    goToStep,
    goNext,
    goBack,
    isStepComplete,
    isFlowComplete,
  }
}
