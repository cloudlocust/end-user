import React from 'react'
import { authTypes, IRoute } from 'src/common/react-platform-components'
import { Login, LoginProps } from './Login'
import { LoginForm as DefaultLoginForm } from 'src/modules/User/Login/LoginForm'
import { BuilderUseLogin } from 'src/modules/User/Login/hooks'
import { URL_NRLINK_CONNECTION } from 'src/modules/nrLinkConnection'

/**
 * Login url.
 */
export const URL_LOGIN = '/login'

/**
 * After login url.
 */
// TODO to reset this once customer first connection is returned by the user
// export const AFTER_LOGIN_URL = '/my-consumption'
export const AFTER_LOGIN_URL = URL_NRLINK_CONNECTION
/**
 * Configuration object for the login page. It contains, url, component and its props, and authentication level needed.
 */

/**
 *
 */
export const LoginConfig = [
    {
        path: URL_LOGIN,
        component: Login,
        auth: { authType: authTypes.anonymousRequired },
        props: {
            LoginForm: (
                <DefaultLoginForm
                    loginHook={BuilderUseLogin({
                        // eslint-disable-next-line jsdoc/require-jsdoc
                        redirect: () => AFTER_LOGIN_URL,
                    })}
                />
            ),
        },
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
    } as IRoute<LoginProps>,
]
