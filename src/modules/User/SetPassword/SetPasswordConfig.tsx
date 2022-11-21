import { authTypes, IRoute } from 'src/common/react-platform-components'
import { SetPassword } from './SetPassword'

const URL_SET_PASSWORD = '/set-password'

const SetPasswordConfig = [
    {
        path: URL_SET_PASSWORD,
        component: SetPassword,
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

export { SetPasswordConfig, URL_SET_PASSWORD }
