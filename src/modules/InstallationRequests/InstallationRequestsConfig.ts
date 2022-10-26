import { authTypes } from 'src/common/react-platform-components'
import { InstallationRequests } from 'src/modules/InstallationRequests'
import { NED_FEATURES_ACTIVE_STATE } from 'src/configs'
import { IRouteNavigationConfig } from 'src/routes'

/**
 *
 */
export interface InstallationRequestsConfigProps {
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

const URL_INSTALLATIONS_REQUESTS = '/installation-requests'

const InstallationsRequestsConfig = [
    {
        path: URL_INSTALLATIONS_REQUESTS,
        component: InstallationRequests,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {},
                },
            },
            disabled: NED_FEATURES_ACTIVE_STATE,
        },
    } as IRouteNavigationConfig<InstallationRequestsConfigProps>,
]

export { InstallationsRequestsConfig, URL_INSTALLATIONS_REQUESTS }
