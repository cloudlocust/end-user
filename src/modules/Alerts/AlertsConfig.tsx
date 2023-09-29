import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import Alerts from 'src/modules/Alerts'

/**
 * Url for myHouse.
 */
export const URL_ALERTS = '/alerts'

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
            disabled: false,
        },

        // eslint-disable-next-line jsdoc/require-jsdoc
    } as IRouteNavigationConfig<{}>,
]
