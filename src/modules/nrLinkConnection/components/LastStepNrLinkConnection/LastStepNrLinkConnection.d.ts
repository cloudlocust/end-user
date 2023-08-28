/**
 *
 */
export interface LastStepNrLinkConnectionProps {
    /**
     * Callback when we pass to the previous step.
     */
    handleBack: () => void
    /**
     * Sets the state indicating whether the NrLink Authorization is in progress.
     */
    setIsNrLinkAuthorizeInProgress: React.Dispatch<React.SetStateAction<boolean>>
    /**
     * Callback when we pass to the next step.
     */
    handleNext: () => void
    /**
     * Housing id.
     */
    housingId?: number
}
