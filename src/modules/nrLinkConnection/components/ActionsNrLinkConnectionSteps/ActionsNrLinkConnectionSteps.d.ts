/**
 * ActionsNrLinkConnectionSteps Props.
 */
export interface ActionsNrLinkConnectionStepsProps {
    /**
     * The number of the current step.
     */
    activeStep: number
    /**
     * Callback when we pass to previous step.
     */
    handleBack: () => void
    /**
     * Callback when we pass to next step.
     */
    handleNext: () => void
    /**
     * Boolean indicating the loading of the ButtonLoading when submitting forms.
     */
    inProgress?: boolean
}
