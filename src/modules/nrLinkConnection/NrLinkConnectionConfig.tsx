import { authTypes, IRoute } from 'src/common/react-platform-components'
import { NrLinkConnection, NrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
// import NrLinkConnection from 'src/modules/nrLinkConnection/NrLinkConnection'
// import NrLinkConnectionSteps from 'src/modules/nrLinkConnection/NrLinkConnectionSteps'

/**
 * Url for NrLinkConnection.
 */
export const URL_NRLINK_CONNECTION = '/nrLinkConnection'
/**
 * Url Component when firstConnection.
 */
export const URL_NRLINK_CONNECTION_STEPS = '/nrLinkConnectionSteps'
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
        auth: { authType: authTypes.loginRequired }, // TODO CHANGE
    } as IRoute</**
     *
     */
    {}>,
    {
        path: URL_NRLINK_CONNECTION_STEPS,
        component: NrLinkConnectionSteps,
        auth: { authType: authTypes.freeAccess }, // TODO CHANGE
    } as IRoute</**
     *
     */
    {}>,
]
