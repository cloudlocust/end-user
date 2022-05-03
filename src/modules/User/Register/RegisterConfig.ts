import { authTypes, IRoute } from 'src/common/react-platform-components'
import Register, { RegisterProps } from './Register'

/**
 * Register url.
 */
export const URL_REGISTER = '/register'

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
        },
    } as IRoute<RegisterProps>,
]
