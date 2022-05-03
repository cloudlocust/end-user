import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { Community } from './Community'

/**
 * Url for community.
 */
export const URL_COMMUNITY = '/community'
/**
 * Interface .
 *
 */
export interface CommunityProps {
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
 * CommunityConfig.
 */
export const CommunityConfig = [
    {
        path: URL_COMMUNITY,
        component: Community,
        auth: { authType: authTypes.freeAccess }, // TODO CHANGE
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'Community',
                        label: 'Communauté',
                        labelAbbreviation: 'Communauté',
                        type: 'item',
                        iconLabel: 'groups',
                        url: URL_COMMUNITY,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<CommunityProps>,
]
