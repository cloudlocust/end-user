import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { Dashboard } from 'src/modules/Dashboard/Dashboard'
import { ReactComponent as DashboardIcon } from 'src/assets/images/navbarItems/dashboard.svg'
import { ReactComponent as DashboardSelectedIcon } from 'src/assets/images/navbarItems/dashboard-selected.svg'
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
 * Env Variable to know if the feature is enabled.
 */
export const isDashboardFeatureEnabled = window._env_.REACT_APP_DASHBOARD_FEATURE_STATE === 'enabled'

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
                        selectedIcon: (
                            <SvgIcon>
                                <DashboardSelectedIcon />,
                            </SvgIcon>
                        ),
                        // disabled: !isDashboardFeatureEnabled,
                        // isHidden: !isDashboardFeatureEnabled,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<DashboardProps>,
]
