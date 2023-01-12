import { authTypes } from 'src/common/react-platform-components'
import { IRouteDisabled } from 'src/routes'
import Register, { RegisterProps } from './Register'

/**
 * Register url.
 */
export const URL_REGISTER = '/register'

/**
 * User registration state.
 *
 */
export const userRegistrationFeatureState = window._env_.REACT_APP_USER_REGISTRATION_FEATURE_STATE === 'disabled'

/**
 * Configuration object for the register page. It contains, url, component and its props, and authentication level needed.
 */
export const RegisterConfig = [
    {
        path: URL_REGISTER,
        component: Register,
        auth: { authType: authTypes.anonymousRequired },
        settings: {
            layout: {
                navbar: {
                    display: false,
                },
                toolbar: {
                    display: false,
                },
            },
            disabled: userRegistrationFeatureState,
        },
    } as IRouteDisabled<RegisterProps>,
]
