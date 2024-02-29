import { IRoute, authTypes } from 'src/common/react-platform-components'
import { SolarSizing } from 'src/modules/SolarSizing'

/**
 * Url for advices.
 */
export const URL_SOLARSIZING = '/solar-sizing'

/**
 * Interface .
 *
 */
export interface SolarSizingProps {
    /**
     * Logo to dislay.
     */
    logo?: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Url of the logo.
         */
        url: string
    }
}

/**
 * AdvicesConfig.
 */
export const SolarSizingConfig = [
    {
        path: URL_SOLARSIZING,
        component: SolarSizing,
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
]
