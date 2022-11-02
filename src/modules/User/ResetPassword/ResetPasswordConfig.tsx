import { authTypes, IRoute } from 'src/common/react-platform-components'
import { ResetPassword } from './ResetPassword'

const URL_RESET_PASSWORD = '/reset-password'
const URL_SET_PASSWORD = '/set-password'

const ResetPasswordConfig = [
    {
        path: URL_RESET_PASSWORD,
        component: ResetPassword,
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
    {
        path: URL_SET_PASSWORD,
        component: ResetPassword,
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

export { ResetPasswordConfig, URL_RESET_PASSWORD, URL_SET_PASSWORD }
