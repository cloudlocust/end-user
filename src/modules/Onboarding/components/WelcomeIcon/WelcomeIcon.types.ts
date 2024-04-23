import { CSSProperties } from 'react'
import { Options } from 'react-lottie'

/**
 * Props for the WelcomeIcon component.
 */
export type WelcomeIconProps =
    /**
     * WelcomeIcon props.
     */
    {
        /**
         * The width of the component.
         */
        width: number
        /**
         * The style object for the component.
         */
        style?: CSSProperties
        /**
         * The options for the Lottie animation.
         */
        options?: Options
    }
