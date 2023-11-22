import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { Dashboard } from 'src/modules/Dashboard/Dashboard'
import { ReactComponent as DashboardIcon } from 'src/assets/images/navbarItems/dashboard.svg'
import SvgIcon from '@mui/material/SvgIcon'

/**
 * Url for advices.
 */
export const URL_DASHBOARD = '/dashboard'

/**
 * Interface .
 *
 */
export interface DashboardProps {
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
 * Dashboard Config.
 */
export const DashboardConfig = [
    {
        path: URL_DASHBOARD,
        component: Dashboard,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'Acceuil',
                        label: 'Acceuil',
                        labelAbbreviation: 'accueil',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <DashboardIcon />,
                            </SvgIcon>
                        ),
                        url: URL_DASHBOARD,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<DashboardProps>,
]
