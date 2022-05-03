import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { Profile } from './Profile'

/**
 * Url for profile.
 */
export const URL_PROFILE = '/profile'
/**
 * Interface .
 *
 */
export interface ProfileProps {
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
 * ProfileConfig.
 */
export const ProfileConfig = [
    {
        path: URL_PROFILE,
        component: Profile,
        auth: { authType: authTypes.freeAccess }, // TODO CHANGE
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'profil',
                        label: 'Profil',
                        labelAbbreviation: 'Profil',
                        type: 'item',
                        iconLabel: 'person',
                        url: URL_PROFILE,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<ProfileProps>,
]
