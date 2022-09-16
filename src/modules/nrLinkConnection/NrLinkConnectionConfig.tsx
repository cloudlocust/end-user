import { authTypes, IRoute } from 'src/common/react-platform-components'
import { NrLinkConnection, NrLinkConnectionSteps } from 'src/modules/nrLinkConnection'

/**
 * Url for NrLinkConnection.
 */
export const URL_NRLINK_CONNECTION = '/nrlink-connection'
/**
 * Url Component when firstConnection.
 */
export const URL_NRLINK_CONNECTION_STEPS = '/nrlink-connection-steps'
/**
 * Url Component when it's for specefic housing.
 */
export const URL_NRLINK_CONNECTION_STEPS_SPECEFIC_HOUSING = '/nrlink-connection-steps/:houseId'

/**
 * Interface .
 *
 */
export interface NrLinkConnectionProps {
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
 * NrLinkConnectionConfig.
 */
export const NrLinkConnectionConfig = [
    {
        path: URL_NRLINK_CONNECTION,
        component: NrLinkConnection,
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
    {
        path: URL_NRLINK_CONNECTION_STEPS,
        component: NrLinkConnectionSteps,
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
    {
        path: URL_NRLINK_CONNECTION_STEPS_SPECEFIC_HOUSING,
        component: NrLinkConnectionSteps,
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
]
