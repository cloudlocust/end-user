import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import Alerts from 'src/modules/Alerts'

/**
 * Url for myHouse.
 */
export const URL_ALERTS = '/alerts'

/**
 * Is consumption alerts configuration showing.
 */
export const isConsumptionAlertsVisible = window._env_.REACT_APP_CONSUMPTION_ALERTS_VISIBILITY === 'enabled'

/**
 * AlertsConfig.
 */
export const AlertsConfig = [
    {
        path: URL_ALERTS,
        component: Alerts,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {},
                },
            },
            disabled: !isConsumptionAlertsVisible,
        },

        // eslint-disable-next-line jsdoc/require-jsdoc
    } as IRouteNavigationConfig<{}>,
]
