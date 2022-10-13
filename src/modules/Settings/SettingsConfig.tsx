import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { Settings } from './Settings'
import { ReactComponent as SettingsIcon } from 'src/assets/images/navbarItems/Settings.svg'
import SvgIcon from '@mui/material/SvgIcon'

/**
 * Url for Settings.
 */
export const URL_SETTINGS = '/settings'
/**
 * Interface .
 *
 */
export interface SettingsProps {
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
 * SettingsConfig.
 */
export const SettingsConfig = [
    {
        path: URL_SETTINGS,
        component: Settings,
        auth: { authType: authTypes.freeAccess }, // TODO CHANGE
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'Settings',
                        label: 'Paramètres',
                        labelAbbreviation: 'Paramètres',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <SettingsIcon />
                            </SvgIcon>
                        ),
                        url: URL_SETTINGS,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<SettingsProps>,
]
