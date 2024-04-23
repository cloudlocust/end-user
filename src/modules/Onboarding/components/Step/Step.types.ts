import { ReactNode } from 'react'

/**
 * Represents the props for the Step component.
 *
 */
export type StepProps =
    /**
     * Step props.
     */
    {
        /**
         * The content of the step.
         */
        content: ReactNode
        /**
         * The title of the step.
         */
        title?: string | ReactNode
    }
