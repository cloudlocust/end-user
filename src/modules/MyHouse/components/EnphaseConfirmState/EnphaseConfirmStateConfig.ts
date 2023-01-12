import { authTypes, IRoute } from 'src/common/react-platform-components'
import { EnphaseConfirmState } from 'src/modules/MyHouse/components/EnphaseConfirmState'

/**
 * Url for my-consumption.
 */
export const URL_ENPHASE_CONFIRM_STATE = '/enphase'
/**
 * Interface .
 *
 */
export interface EnphaseConfirmStateProps {
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
 * MyConsumptionConfig.
 */
export const EnphaseConfirmStateConfig = [
    {
        path: URL_ENPHASE_CONFIRM_STATE,
        component: EnphaseConfirmState,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    display: false,
                },
                toolbar: {
                    display: false,
                },
            },
        },
    } as IRoute<EnphaseConfirmStateProps>,
]
