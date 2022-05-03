import { authTypes, IRoute } from 'src/common/react-platform-components'
import { ForgotPasswordProps, ForgotPassword } from './ForgotPassword'
import ForgotPasswordSuccess from './containers/ForgotPasswordSuccess/ForgotPasswordSuccess'

const URL_FORGET_PASSWORD = '/forgot-password'
const URL_FORGET_PASSWORD_SUCCESS = '/forgot-password-success'

const ForgotPasswordConfig = [
    {
        path: URL_FORGET_PASSWORD,
        component: ForgotPassword,
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
    } as IRoute<ForgotPasswordProps>,
    {
        path: URL_FORGET_PASSWORD_SUCCESS,
        component: ForgotPasswordSuccess,
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
    } as IRoute</**
     *
     */
    {}>,
]

export { ForgotPasswordConfig, URL_FORGET_PASSWORD }
