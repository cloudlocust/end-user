import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { Advices } from './Advices'

/**
 * Url for advices.
 */
export const URL_ADVICES = '/advices'
/**
 * Interface .
 *
 */
export interface AdvicesProps {
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
export const AdvicesConfig = [
    {
        path: URL_ADVICES,
        component: Advices,
        auth: { authType: authTypes.anonymousRequired }, // TODO CHANGE
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'Conseils',
                        label: 'Conseils',
                        labelAbbreviation: 'Conseils',
                        type: 'item',
                        iconLabel: 'pan_tool',
                        url: URL_ADVICES,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<AdvicesProps>,
]
