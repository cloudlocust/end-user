import React from 'react'
import { authTypes, IRoute } from 'src/common/react-platform-components'
import { Login, LoginProps } from './Login'
import { LoginForm as DefaultLoginForm } from 'src/modules/User/Login/LoginForm'
import { BuilderUseLogin } from 'src/modules/User/Login/hooks'

/**
 * Login url.
 */
export const URL_LOGIN = '/login'

/**
 * After login url.
 */
export const AFTER_LOGIN_URL = '/my-consumption'
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
