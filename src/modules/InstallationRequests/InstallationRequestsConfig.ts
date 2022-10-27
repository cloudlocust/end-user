import { authTypes } from 'src/common/react-platform-components'
import { InstallationRequests } from 'src/modules/InstallationRequests'
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

/**
 * Env variable to know if the installation requests feature is enabled.
 */
export const installationRequestsFeatureState =
    window._env_.REACT_APP_INSTALLATION_REQUESTS_FEATURE_STATE === 'disabled'

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
            disabled: installationRequestsFeatureState,
        },
    } as IRouteNavigationConfig<InstallationRequestsConfigProps>,
]

export { InstallationsRequestsConfig, URL_INSTALLATIONS_REQUESTS }
